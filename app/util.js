const showdown = require('showdown');
const converter = new showdown.Converter();
const moment = require('moment');

module.exports = {
  registerHandlebarsHelper: function(hbs) {
    const blocks = {};
    hbs.registerHelper('extend', function(name, context) {
      var block = blocks[name];
      if (!block) {
        block = blocks[name] = [];
      }

      block.push(context.fn(this));
    });

    hbs.registerHelper('block', function(name) {
      var val = (blocks[name] || []).join('\n');

      blocks[name] = [];
      return val;
    });

    hbs.registerHelper('lg', function(v1, v2, options) {
      if (v1 > v2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    hbs.registerHelper('compare', function(a, operator, b, options) {
      if (arguments.length < 4) {
        throw new Error('handlebars Helper {{compare}} expects 4 arguments');
      }

      var result;
      switch (operator) {
        case '==':
          result = a == b;
          break;
        case '===':
          result = a === b;
          break;
        case '!=':
          result = a != b;
          break;
        case '!==':
          result = a !== b;
          break;
        case '<':
          result = a < b;
          break;
        case '>':
          result = a > b;
          break;
        case '<=':
          result = a <= b;
          break;
        case '>=':
          result = a >= b;
          break;
        case 'typeof':
          result = typeof a === b;
          break;
        default: {
          throw new Error('helper {{compare}}: invalid operator: `' + operator + '`');
        }
      }

      if (result === false) {
        return options.inverse(this);
      }
      return options.fn(this);
    });

    hbs.registerHelper('math', function(lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);

      return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
      }[operator];
    });

    hbs.registerHelper('moment', function(date, format, options) {
      if (!(date instanceof Date)) {
        date = moment(new Date(date));
      }

      return moment(date).format(format);
    });

    hbs.registerHelper('display-top', function(top, options) {
      return top < 1 ? '否' : '是';
    });

    hbs.registerHelper('display-post-state', function(status, options) {
      let text;

      switch (status) {
        case 'draft':
          text = '草稿';
          break;
        case 'published':
          text = '已发布';
          break;
        default:
          text = '未知状态';
          break;
      }

      return text;
    });

    hbs.registerHelper('table-index', function(index, pageIndex, pageSize, options) {
      return index + 1 + pageIndex * pageSize;
    });

    hbs.registerHelper('generate-summary', function(content, options) {
      let summary = content.substring(0, 80);
      summary = converter.makeHtml(summary);
      return summary;
    });
    hbs.registerHelper('convert-summary', function(summary, options) {
      return converter.makeHtml(summary);
    });
  },
};
