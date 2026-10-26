import {
  type FieldManifest,
  type ObjectManifest,
  type PageLayoutWidgetManifest,
} from 'twenty-shared/application';
import { type UniversalConditionalDisplay } from 'twenty-shared/types';
import { compileLegacyWidgetJsonLogic, isDefined } from 'twenty-shared/utils';

export const compilePageLayoutWidgetJsonLogic = ({
  widget,
  objects,
  fields,
  relativePath,
}: {
  widget: PageLayoutWidgetManifest;
  objects: ObjectManifest[];
  fields: FieldManifest[];
  relativePath: string;
}): { conditionalDisplay?: UniversalConditionalDisplay; errors: string[] } => {
  const { objectUniversalIdentifier } = widget;

  const findField = (fieldName: string) =>
    [
      ...(objects.find(
        ({ universalIdentifier }) =>
          universalIdentifier === objectUniversalIdentifier,
      )?.fields ?? []),
      ...fields.filter(
        (field) =>
          field.objectUniversalIdentifier === objectUniversalIdentifier,
      ),
    ].find(({ name }) => name === fieldName);

  try {
    const { recordFilters = [], ...conditionalDisplay } =
      compileLegacyWidgetJsonLogic({
        jsonLogic: widget.conditionalDisplay,
        resolveField: (fieldName) => {
          const field = isDefined(objectUniversalIdentifier)
            ? findField(fieldName)
            : undefined;

          return isDefined(field)
            ? { fieldMetadataId: field.universalIdentifier, type: field.type }
            : undefined;
        },
      });

    return {
      conditionalDisplay: {
        ...conditionalDisplay,
        recordFilters: recordFilters.map(
          ({ fieldMetadataId, ...recordFilter }) =>
            isDefined(fieldMetadataId)
              ? {
                  ...recordFilter,
                  fieldMetadataUniversalIdentifier: fieldMetadataId,
                }
              : recordFilter,
        ),
      },
      errors: [],
    };
  } catch (error) {
    return {
      errors: [
        `${relativePath} - conditionalDisplay of page layout widget "${widget.title}" cannot be compiled into a tree: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
};
