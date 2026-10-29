import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { stop } from 'esbuild';
import { EMPTY_YARN_LOCK_CONTENT } from 'twenty-shared/application';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { buildTestAppWorker } from '@/app/__tests__/utils/build-test-app-worker';
import { buildAndValidateManifest } from '@/app/manifest/build-and-validate-manifest';
import { buildManifest } from '@/app/manifest/manifest-build';
import { createAppProject } from '@/app/create-app-project';
import { runAppWorker } from '@/app/run-app-worker';
import { compileApplicationTranslations } from '@/app/translations/compile-application-translations';

const launch = vi.hoisted(() => ({ modulePath: '', execArgv: [] as string[] }));

vi.mock('@/app/get-app-worker-launch', () => ({
  getAppWorkerLaunch: () => launch,
}));
vi.mock('@/app/get-app-template-directory', () => ({
  getAppTemplateDirectory: () =>
    join(REPOSITORY_ROOT, 'packages/twenty-cli/app-template'),
}));

const REPOSITORY_ROOT = fileURLToPath(
  new URL('../../../../../../', import.meta.url),
);
const FIXTURES_DIRECTORY = join(
  REPOSITORY_ROOT,
  'packages/twenty-apps/fixtures',
);
const FIXTURES = [
  'minimal-app',
  'rich-app',
  'function-execute-app',
  'shared-dependencies-app',
  'invalid-app',
  'conditional-availability-app',
  'unmapped-conditional-availability-app',
];

const FAILING_FIXTURES = [
  'invalid-app',
  'unmapped-conditional-availability-app',
];

const json = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

describe('CLI manifest fixtures and worker transport', () => {
  let root: string;

  const copyFixture = async (name: string) => {
    const appPath = await mkdtemp(join(root, `${name}-`));

    await cp(join(FIXTURES_DIRECTORY, name), appPath, {
      recursive: true,
      filter: (source) =>
        !source
          .split('/')
          .some((part) => ['node_modules', '.twenty', 'dist'].includes(part)),
    });
    await symlink(join(root, 'node_modules'), join(appPath, 'node_modules'));

    return appPath;
  };

  const compareManifest = async (appPath: string) => {
    const expected = await buildAndValidateManifest(appPath).catch(
      (error: unknown) => ({
        thrown: error instanceof Error ? error.message : String(error),
      }),
    );

    if ('thrown' in expected) {
      await expect(buildAndValidateManifest(appPath)).rejects.toThrow(
        expected.thrown,
      );
      const worker = await runAppWorker({
        request: { type: 'buildManifest', appPath },
        signal: new AbortController().signal,
      });

      expect(worker.result).toMatchObject({
        success: false,
        error: { code: 'MANIFEST_BUILD_FAILED', message: expected.thrown },
      });

      return { success: false as const, errors: [expected.thrown] };
    }

    const warnings: string[] = [];
    const translations = expected.success
      ? await compileApplicationTranslations({
          appPath,
          onWarning: (message) => warnings.push(message),
        })
      : undefined;
    const worker = await runAppWorker({
      request: { type: 'buildManifest', appPath },
      signal: new AbortController().signal,
    });

    expect(worker.isSnapshotHeld).toBe(false);
    expect(worker.result).toEqual(
      json(
        expected.success
          ? {
              success: true,
              data: {
                manifest: { ...expected.manifest, translations },
                filePaths: expected.filePaths,
              },
              diagnostics: [...expected.warnings, ...warnings].map(
                (message) => ({
                  severity: 'warning',
                  code: 'BUILD_WARNING',
                  message,
                }),
              ),
            }
          : {
              success: false,
              error: {
                code: 'MANIFEST_BUILD_FAILED',
                message: expected.errors.join('\n'),
              },
              diagnostics: expected.errors.map((message) => ({
                severity: 'error',
                code: 'MANIFEST_BUILD_FAILED',
                message,
              })),
            },
      ),
    );

    return expected;
  };

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'twenty-manifest-parity-'));
    const modules = join(root, 'node_modules');
    const sdkPath = join(modules, 'twenty-sdk');
    const sourceSdk = join(REPOSITORY_ROOT, 'packages/twenty-sdk');
    const sdkRequire = createRequire(join(sourceSdk, 'package.json'));
    const sdkResolvedModulePaths: Record<string, string> = {
      uuid: dirname(sdkRequire.resolve('uuid/package.json')),
      'twenty-shared': dirname(dirname(sdkRequire.resolve('twenty-shared'))),
    };

    await mkdir(join(modules, '@sniptt'), { recursive: true });

    for (const name of [
      'react',
      'react-dom',
      '@sniptt/guards',
      'uuid',
      'esbuild',
      'typescript',
      'tinyglobby',
      'twenty-shared',
      'twenty-client-sdk',
      'twenty-ui',
    ]) {
      await symlink(
        sdkResolvedModulePaths[name] ??
          join(REPOSITORY_ROOT, 'node_modules', name),
        join(modules, name),
      );
    }

    const packageJson = JSON.parse(
      await readFile(join(sourceSdk, 'package.json'), 'utf8'),
    );
    const exports: Record<string, unknown> = {};

    for (const name of [
      'define',
      'front-component',
      'logic-function',
      'billing',
      'utils',
    ]) {
      await cp(join(sourceSdk, 'dist', name), join(sdkPath, 'dist', name), {
        recursive: true,
      });
      exports[`./${name}`] = packageJson.exports[`./${name}`];
    }

    await writeFile(
      join(sdkPath, 'package.json'),
      JSON.stringify({
        name: packageJson.name,
        version: packageJson.version,
        engines: packageJson.engines,
        exports,
      }),
    );
    expect(() =>
      createRequire(join(root, 'package.json')).resolve('twenty-sdk/build'),
    ).toThrow();

    await buildTestAppWorker(join(root, 'cli'));
    launch.modulePath = join(root, 'cli/app-worker.cjs');
  }, 60000);

  afterEach(() => vi.unstubAllEnvs());
  afterAll(async () => {
    await stop();
    await rm(root, { recursive: true, force: true });
  });

  it('covers every repository fixture', async () => {
    expect(
      (await readdir(FIXTURES_DIRECTORY, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort(),
    ).toEqual([...FIXTURES].sort());
  });

  it.each(FIXTURES)(
    'matches the manifest, file paths, errors and warnings for %s',
    async (name) => {
      const appPath = await copyFixture(name);
      const result = await compareManifest(appPath);

      expect(result.success).toBe(!FAILING_FIXTURES.includes(name));
      expect(
        JSON.parse(JSON.stringify(result).replaceAll(appPath, '<app>')),
      ).toMatchSnapshot();
    },
    60000,
  );

  it('matches compiled command menu item trees and expression compile errors', async () => {
    const result = await compareManifest(
      await copyFixture('conditional-availability-app'),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        result.manifest.commandMenuItems.map(
          ({ label, conditionalAvailability, conditionalPinned }) => ({
            label,
            hasConditionalAvailability: conditionalAvailability !== undefined,
            hasConditionalPinned: conditionalPinned !== undefined,
          }),
        ),
      ).toEqual([
        {
          label: 'Simple boolean',
          hasConditionalAvailability: true,
          hasConditionalPinned: false,
        },
        {
          label: 'Selected records count',
          hasConditionalAvailability: true,
          hasConditionalPinned: true,
        },
        {
          label: 'Not select all',
          hasConditionalAvailability: true,
          hasConditionalPinned: false,
        },
        {
          label: 'Always available',
          hasConditionalAvailability: false,
          hasConditionalPinned: false,
        },
      ]);
      expect(JSON.stringify(result.manifest.commandMenuItems)).not.toMatch(
        /conditionalAvailabilityExpression|conditionalPinnedExpression/,
      );
    }

    const unmappedResult = await compareManifest(
      await copyFixture('unmapped-conditional-availability-app'),
    );

    expect(unmappedResult.success).toBe(false);
    if (!unmappedResult.success) {
      expect(unmappedResult.errors).toEqual([
        expect.stringContaining(
          'src/command-menu-items/favorite-count.command-menu-item.ts - conditionalAvailabilityExpression of command menu item "Favorite count" cannot be compiled into a conditionalAvailability tree: Cannot compile conditional availability expression "favoriteRecordIds.length > 0"',
        ),
        expect.stringContaining(
          'src/command-menu-items/selected-records-pinned.command-menu-item.ts - conditionalPinnedExpression of command menu item "Selected records pinned" cannot be compiled into a conditionalPinned tree:',
        ),
      ]);
    }
  }, 60000);

  it('matches a freshly initialized app and its server requirement', async () => {
    const appPath = join(root, 'fresh-app');

    await createAppProject({
      appDirectory: appPath,
      appName: 'fresh-app',
      appDisplayName: 'Fresh app',
      appDescription: 'Parity fixture',
      signal: new AbortController().signal,
    });
    await symlink(join(root, 'node_modules'), join(appPath, 'node_modules'));
    await writeFile(join(appPath, 'yarn.lock'), EMPTY_YARN_LOCK_CONTENT);
    const result = await compareManifest(appPath);
    const packageJson = JSON.parse(
      await readFile(join(appPath, 'package.json'), 'utf8'),
    );

    expect(result.success).toBe(true);
    if (result.success)
      expect(result.manifest.application.requiredServerVersionRange).toBe(
        packageJson.engines.twenty,
      );
  }, 60000);

  it('matches authored and compiled translations and malformed catalog warnings', async () => {
    const appPath = await copyFixture('minimal-app');

    await mkdir(join(appPath, 'locales/compiled'), { recursive: true });
    await writeFile(
      join(appPath, 'locales/fr-FR.json'),
      JSON.stringify({
        Company: 'Entreprise',
        door: { Open: 'Ouvrir' },
        Empty: '',
      }),
    );
    await writeFile(
      join(appPath, 'locales/compiled/fr-FR.json'),
      JSON.stringify({ orphan: 'Conservé' }),
    );
    await writeFile(join(appPath, 'locales/de-DE.json'), '{');
    await writeFile(join(appPath, 'locales/klingon.json'), '{}');
    await compareManifest(appPath);
  }, 60000);

  it('matches duplicate identifier diagnostics and empty lockfile failures', async () => {
    const appPath = await copyFixture('minimal-app');
    const duplicate = join(appPath, 'duplicate.role.ts');

    await cp(join(appPath, 'my.role.ts'), duplicate);
    const duplicateResult = await compareManifest(appPath);

    expect(duplicateResult.success).toBe(false);
    if (!duplicateResult.success)
      expect(duplicateResult.errors.join('\n')).toContain(
        'Duplicate universal identifiers',
      );

    await rm(duplicate);
    await writeFile(join(appPath, 'yarn.lock'), '');
    const lockResult = await compareManifest(appPath);

    expect(lockResult).toEqual({
      success: false,
      errors: [
        'yarn.lock is empty. Run "yarn install" to regenerate it before building.',
      ],
    });
  }, 60000);

  it('matches a workflow definition and its validation errors', async () => {
    const appPath = await copyFixture('minimal-app');
    const writeWorkflow = (stepType: string) =>
      writeFile(
        join(appPath, 'my.workflow.ts'),
        `import { defineWorkflow } from 'twenty-sdk/define';

export default defineWorkflow({
  universalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000060',
  name: 'My workflow',
  version: {
    trigger: {
      universalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000061',
      type: 'MANUAL',
      nextStepIds: ['e1e2e3e4-e5e6-4000-8000-000000000062'],
    },
    steps: [
      {
        universalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000062',
        name: 'Run my function',
        type: '${stepType}',
        logicFunctionUniversalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000010',
        input: {},
        nextStepIds: [],
      },
    ],
  },
});
`,
      );

    await writeWorkflow('LOGIC_FUNCTION');
    const result = await compareManifest(appPath);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.manifest.workflows).toHaveLength(1);
      expect(result.filePaths.workflows).toEqual(['my.workflow.ts']);
    }

    await writeWorkflow('CODE');
    const invalidResult = await compareManifest(appPath);

    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      expect(invalidResult.errors.join('\n')).toContain(
        'Unsupported step type',
      );
    }
  }, 60000);

  it('compiles json-logic widget rules on the device and on app fields into trees', async () => {
    const appPath = await copyFixture('minimal-app');
    const writeSelectField = (
      fileName: string,
      universalIdentifier: string,
      type: string,
      name: string,
    ) =>
      writeFile(
        join(appPath, fileName),
        `import { defineField, FieldType } from 'twenty-sdk/define';

export default defineField({
  objectUniversalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000030',
  universalIdentifier: '${universalIdentifier}',
  type: FieldType.${type},
  name: '${name}',
  label: '${name}',
  options: [
    { value: 'VALUE_1', label: 'Value 1', color: 'blue', position: 0 },
    { value: 'VALUE_2', label: 'Value 2', color: 'green', position: 1 },
  ],
});
`,
      );
    const writeTab = (multiSelectFieldName: string) =>
      writeFile(
        join(appPath, 'my.page-layout-tab.ts'),
        `import {
  definePageLayoutTab,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

const widget = (index: number, conditionalDisplay: object) => ({
  universalIdentifier: \`e1e2e3e4-e5e6-4000-8000-00000000007\${index}\`,
  title: \`Widget \${index}\`,
  type: 'FRONT_COMPONENT' as const,
  objectUniversalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000030',
  conditionalDisplay,
  configuration: {
    configurationType: 'FRONT_COMPONENT' as const,
    frontComponentUniversalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000020',
  },
});

export default definePageLayoutTab({
  universalIdentifier: 'e1e2e3e4-e5e6-4000-8000-000000000070',
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage
      .universalIdentifier,
  title: 'My tab',
  position: 1000,
  widgets: [
    widget(1, { and: [{ '===': [{ var: 'device' }, 'MOBILE'] }] }),
    widget(2, { in: ['VALUE_1', { var: 'selectedRecords.0.${multiSelectFieldName}' }] }),
    widget(3, { '!==': [{ var: 'selectedRecords.0.mySelect' }, 'VALUE_2'] }),
  ],
});
`,
      );

    await writeSelectField(
      'my-select.field.ts',
      'e1e2e3e4-e5e6-4000-8000-000000000081',
      'SELECT',
      'mySelect',
    );
    await writeSelectField(
      'my-multi-select.field.ts',
      'e1e2e3e4-e5e6-4000-8000-000000000082',
      'MULTI_SELECT',
      'myMultiSelect',
    );
    await writeTab('myMultiSelect');
    const result = await compareManifest(appPath);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        result.manifest.pageLayoutTabs[0].widgets?.map(
          ({ conditionalDisplay }) => conditionalDisplay,
        ),
      ).toEqual([
        {
          recordFilters: [
            {
              id: '0',
              contextKey: 'device',
              operand: 'IS',
              value: '["MOBILE"]',
            },
          ],
        },
        {
          recordFilters: [
            {
              id: expect.any(String),
              fieldMetadataUniversalIdentifier:
                'e1e2e3e4-e5e6-4000-8000-000000000082',
              operand: 'CONTAINS',
              value: '["VALUE_1"]',
            },
          ],
        },
        {
          recordFilters: [
            {
              id: expect.any(String),
              fieldMetadataUniversalIdentifier:
                'e1e2e3e4-e5e6-4000-8000-000000000081',
              operand: 'IS_NOT',
              value: '["VALUE_2"]',
            },
          ],
        },
      ]);
    }

    await writeTab('missingField');
    const invalidResult = await compareManifest(appPath);

    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      expect(invalidResult.errors).toEqual([
        expect.stringContaining(
          'my.page-layout-tab.ts - conditionalDisplay of page layout widget "Widget 2" cannot be compiled into a tree: Cannot convert legacy widget json-logic {"in":["VALUE_1",{"var":"selectedRecords.0.missingField"}]}: unknown field "missingField"',
        ),
      ]);
    }
  }, 60000);

  it('keeps evaluated source output and workspace credentials outside the manifest result', async () => {
    const appPath = await copyFixture('minimal-app');
    const applicationFiles = (await buildManifest(appPath)).filePaths
      .application;
    const filePath = join(appPath, applicationFiles[0]);

    await writeFile(
      filePath,
      `console.log('manifest source output');
if (process.env.TWENTY_API_KEY) throw new Error('workspace credential leaked');
${await readFile(filePath, 'utf8')}`,
    );
    vi.stubEnv('TWENTY_API_KEY', 'must-not-reach-app');
    const worker = await runAppWorker({
      request: { type: 'buildManifest', appPath },
      signal: new AbortController().signal,
    });

    expect(worker.result).toMatchObject({ success: true });
    expect(JSON.stringify(worker.output)).toContain('manifest source output');
    expect(JSON.stringify(worker.result)).not.toContain(
      'manifest source output',
    );
  }, 60000);
});
