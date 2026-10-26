import ts from 'typescript';

type ScannedToken = {
  kind: ts.SyntaxKind;
  text: string;
};

const TOKEN_TEXT_REPLACEMENTS: Partial<Record<ts.SyntaxKind, string>> = {
  [ts.SyntaxKind.AmpersandAmpersandToken]: 'and',
  [ts.SyntaxKind.BarBarToken]: 'or',
  [ts.SyntaxKind.EqualsEqualsEqualsToken]: '==',
  [ts.SyntaxKind.ExclamationEqualsEqualsToken]: '!=',
  [ts.SyntaxKind.ExclamationToken]: 'not ',
};

const ARRAY_LENGTH_VARIABLE_NAMES = ['favoriteRecordIds', 'selectedRecords'];

const isWhitespaceToken = (token: ScannedToken | undefined) =>
  token?.kind === ts.SyntaxKind.WhitespaceTrivia ||
  token?.kind === ts.SyntaxKind.NewLineTrivia;

const scanTokens = (expressionText: string): ScannedToken[] => {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    expressionText,
  );
  const tokens: ScannedToken[] = [];

  for (
    let kind = scanner.scan();
    kind !== ts.SyntaxKind.EndOfFileToken;
    kind = scanner.scan()
  ) {
    tokens.push({ kind, text: scanner.getTokenText() });
  }

  return tokens;
};

export const printConditionalAvailabilityIdSeed = (
  expressionText: string,
): string => {
  const tokens = scanTokens(expressionText);
  let printedText = '';

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];

    if (
      token.kind === ts.SyntaxKind.Identifier &&
      ARRAY_LENGTH_VARIABLE_NAMES.includes(token.text) &&
      tokens[index + 1]?.kind === ts.SyntaxKind.DotToken &&
      tokens[index + 2]?.text === 'length'
    ) {
      printedText += `arrayLength(${token.text})`;
      index += 2;
      continue;
    }

    if (token.kind === ts.SyntaxKind.CommaToken) {
      let nextIndex = index + 1;

      while (isWhitespaceToken(tokens[nextIndex])) {
        nextIndex++;
      }

      if (tokens[nextIndex]?.kind === ts.SyntaxKind.CloseParenToken) {
        continue;
      }
    }

    printedText += TOKEN_TEXT_REPLACEMENTS[token.kind] ?? token.text;
  }

  return printedText;
};
