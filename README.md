
# PDF.js Fork

The original package is here: https://github.com/mozilla/pdf.js

The repo was forked to make my changes to the acroform example available for review. Just some tweaks to see if it we could use PDF.js in our project to work with fillable forms. I hacked together JS that mirrors the collection of annotations (form inputs) into an object which updates as the user updates fields. Shows that we can track the fields, could pass JSON to the server with form values, and can programmatically fill the form with know information.

I did note that the `pdfPage.getAnnotations()` method that returns the annotations seems to only return text fields, and not checkboxes. Though I don't think it would cause any trouble to retrieve the annotations by querying the DOM instead.

## Usage

Install dependencies.

```
npm i
```

Run the Gulp server.

```bash
npx gulp server
```

Visit http://localhost:8888/examples/acroforms/acroforms.html.

Alternatively follow the instructions here: https://github.com/mozilla/pdf.js#getting-the-code