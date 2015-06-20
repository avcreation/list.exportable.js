# list.exportable.js
An export plugin for List.js

This plugin allow you to export a table used by List.Js in CSV (for now)

Thanks to [Terry Young on SO](http://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html) whose answer helps me create the export function.


# Requires
  - jQuery >= 1.7 < 2.0
  - List.Js

# Usage

    <script>
    $(document).ready(function () {
        // defining list options
        var options = {
            valueNames: ['col1', 'col2', '...']
            plugins: [
              ListExportable({
                linkContainersSelector: ".exporters",
                exportLinkTemplate: '<a href=''>Export {{type}}</a>',
                type: ['csv'],  // only csv for now, sorry...
                filename: "export",  // some browsers will not handle the filename definition
              })
            ]
        };

        var listObj = new List('myTabelListId', options);

    });
    </script>

The export links container must exists at the List.Js plugin initialisation time.

# TODO

  - Implement more export method
  - Make tests

## License
MIT
