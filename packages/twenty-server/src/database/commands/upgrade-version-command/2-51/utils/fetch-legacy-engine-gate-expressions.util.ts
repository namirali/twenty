import { type DataSource } from 'typeorm';

import { type LegacyEngineGateExpressions } from 'src/database/commands/upgrade-version-command/2-51/types/legacy-engine-gate-expressions.type';

type LegacyCommandMenuItemExpressionsRow = LegacyEngineGateExpressions & {
  id: string;
};

type LegacyPageLayoutWidgetExpressionRow = Pick<
  LegacyEngineGateExpressions,
  'conditionalAvailabilityExpression'
> & {
  id: string;
};

export const fetchLegacyEngineGateExpressions = async ({
  coreDataSource,
  workspaceId,
}: {
  coreDataSource: DataSource;
  workspaceId: string;
}): Promise<{
  commandMenuItemExpressionsById: Map<string, LegacyEngineGateExpressions>;
  pageLayoutWidgetExpressionsById: Map<string, LegacyEngineGateExpressions>;
}> => {
  const commandMenuItemRows: LegacyCommandMenuItemExpressionsRow[] =
    await coreDataSource.query(
      `select id, "conditionalAvailabilityExpression", "conditionalPinnedExpression" from core."commandMenuItem" where "workspaceId" = $1`,
      [workspaceId],
    );
  const pageLayoutWidgetRows: LegacyPageLayoutWidgetExpressionRow[] =
    await coreDataSource.query(
      `select id, "conditionalAvailabilityExpression" from core."pageLayoutWidget" where "workspaceId" = $1`,
      [workspaceId],
    );

  return {
    commandMenuItemExpressionsById: new Map(
      commandMenuItemRows.map(
        ({
          id,
          conditionalAvailabilityExpression,
          conditionalPinnedExpression,
        }) => [
          id,
          { conditionalAvailabilityExpression, conditionalPinnedExpression },
        ],
      ),
    ),
    pageLayoutWidgetExpressionsById: new Map(
      pageLayoutWidgetRows.map(({ id, conditionalAvailabilityExpression }) => [
        id,
        { conditionalAvailabilityExpression, conditionalPinnedExpression: null },
      ]),
    ),
  };
};
