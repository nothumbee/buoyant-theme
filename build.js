const StyleDictionary = require("style-dictionary");

const { fileHeader } = StyleDictionary.formatHelpers;

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE CUSTOM TRANFORMS

// REGISTER THE CUSTOM TRANFORM GROUPS

// REGISTER A CUSTOM FORMAT (to be used for this specific example)

StyleDictionary.registerFormat({
  name: "custom/android/xml",
  formatter: function ({ dictionary }) {
    return dictionary.allTokens
      .map(function (token) {
        return `<item name="${token.name}">${token.value}</item>`;
      })
      .join("\n");
  },
});

// token-transformer libs/buoyant-theme/tokens/tokens.json libs/buoyant-theme/tokens/tokensTransformed.json --expandTypography=true &&
const flipTokens = (tokens) =>
  Object.entries(tokens).reduce((prev, [key, token]) => {
    if (!token.type) {
      const flipped = flipTokens(token);
      const [key, value] = Object.entries(flipped)[0];
      return {
        ...prev, 
        [key]: {
          ...prev[key],
          ...value,
        },
      };
    }
    return {
      ...prev,
      [token.type]: { ...prev[token.type], [token.name]: token.value },
    };
  }, {});

StyleDictionary.registerFormat({
  name: "javascript/objectCustom",
  formatter: function ({ dictionary, platform, options, file }) {
    const newDic = flipTokens(dictionary.tokens);
    return (
      fileHeader({ file }) +
      "const theme = " +
      JSON.stringify(newDic, null, 2) +
      ";" +
      "\nexport default theme;"
    );
  },
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtended = StyleDictionary.extend(
  __dirname + "build-config.json"
);

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");
