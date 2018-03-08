const babel = require("babel-core");

const result = babel.transform("const result = 1 + 2;",{
  plugins:[
    require("./babel")
  ]
});

console.log(result.code); // const result = 3;