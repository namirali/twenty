export const buildConditionalAvailabilityCompilationError = ({
  expression,
  reason,
}: {
  expression: string;
  reason: string;
}) =>
  new Error(
    `Cannot compile conditional availability expression "${expression}": ${reason}`,
  );
