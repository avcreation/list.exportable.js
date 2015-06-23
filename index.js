var classes = require('classes'),
  events = require('event');

module.exports = function (options) {
  options = options || {};

  var list;

  var _get_exportable_columns = function () {
    var toExportCols = {};
    list.valueNames.forEach(function (item) {
      toExportCols[item] = item;
    });
    return toExportCols;
  };

  var _computeCsv = function () {
    /*
     * Thanks to Terry Young on SO
     * http://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html
     */
    var $rows = list.matchingItems,
      // Temporary delimiter characters unlikely to be typed by keyboard
      // This is to avoid accidentally splitting the actual contents
      tmpColDelim = String.fromCharCode(11), // vertical tab character
      tmpRowDelim = String.fromCharCode(0), // null character
      // actual delimiter characters for CSV format
      colDelim = options.colDelim || '","',
      rowDelim = options.rowDelim || '"\r\n"',
      // define cols to exports
      toExportCols = options.toExportCols || _get_exportable_columns(),
      csvHeaderList = [],
      csvHeader = '"',
      csvBody,
      csv,
      headerCol;

    // Grab text from table into CSV formatted string
    for (headerCol in toExportCols) {
      if (toExportCols.hasOwnProperty(headerCol) && list.valueNames.indexOf(toExportCols[headerCol]) >= 0) {
        csvHeaderList.push(headerCol);
      }
    }
    csvHeader = '"' + csvHeaderList.join(tmpColDelim)
                                  .split(tmpRowDelim).join(rowDelim)
                                  .split(tmpColDelim).join(colDelim);

    csvBody = $rows.map(function (item) {
      var vals = item.values(),
        itemValueCol,
        col,
        cols = [];

      for (col in toExportCols) {
        if (toExportCols.hasOwnProperty(col)) {
          itemValueCol = toExportCols[col];
          if (vals.hasOwnProperty(itemValueCol)) {
            cols.push(vals[itemValueCol]);
          }
        }
      }
      return cols.join(tmpColDelim);
    }).join(tmpRowDelim)
      .split(tmpRowDelim).join(rowDelim)
      .split(tmpColDelim).join(colDelim) + '"';

    csv = [csvHeader, csvBody].join(tmpRowDelim)
                              .split(tmpRowDelim).join(rowDelim)
                              .split(tmpColDelim).join(colDelim);

    // Data URI
    return 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
  };

  var _export = function () {
    /*
     * For now, only implement the csv export
     */
    // TODO: implement other computing methods
    var data = _computeCsv(),
      ext = ".csv",
      filename = options.filename || "export",
      linkContainersSelector = options.linkContainersSelector || ".exporters";
    // send date through link
    $(linkContainersSelector + " a")
      .attr({
        'download': filename + ext,
        'href': data,
        'target': '_blank'
      });
  };

  var bindLinks = function () {
    var linkContainersSelector = options.linkContainersSelector || ".exporters";
    $(linkContainersSelector + " a")
      .on('click', function () {
        _export();
      });
  };

  var createLinks = function () {
    var type = options.type || ['csv'],
      linkContainersSelector = options.linkContainersSelector || ".exporters",
      exportLinkTemplate = options.exportLinkTemplate || "<a href=''>Export {{type}}</a>",
      i = 0;

    // reset linContainers
    $(linkContainersSelector).html("");
    for (i = 0; i < type.length; ++i) {
      $(linkContainersSelector)
        .append(exportLinkTemplate.replace("{{type}}", type[i]));
    }
  };

  return {
    init: function (parentList) {
      list = parentList;
      createLinks();
      bindLinks();
    },
    name: options.name || "exporter",
  };
};
