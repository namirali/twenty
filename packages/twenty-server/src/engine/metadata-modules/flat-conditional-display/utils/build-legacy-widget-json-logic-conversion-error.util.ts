export const buildLegacyWidgetJsonLogicConversionError = ({
  jsonLogic,
  reason,
}: {
  jsonLogic: unknown;
  reason: string;
}): Error =>
  new Error(
    `Cannot convert legacy widget json-logic ${JSON.stringify(jsonLogic)}: ${reason}`,
  );
