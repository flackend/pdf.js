/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../node_modules/pdfjs-dist/build/pdf.worker.js";

var DEFAULT_URL = "./fw4.pdf";
var DEFAULT_SCALE = 1.0;

var container = document.getElementById("pageContainer");

var eventBus = new pdfjsViewer.EventBus();

// Fetch the PDF document from the URL using promises.
var loadingTask = pdfjsLib.getDocument(DEFAULT_URL);
loadingTask.promise.then(function (doc) {
  // Use a promise to fetch and render the next page.
  var promise = Promise.resolve();


  let values = {};
  const jsonElem = document.getElementById('json-viewer');

  const changeHandler = (event) => {
    values[event.currentTarget.annotation.id] = event.currentTarget.value;
    drawJSON();
  };

  const drawJSON = () => {
    jsonElem.textContent = JSON.stringify(values, undefined, 2);
  }


  for (var i = 1; i <= doc.numPages; i++) {
    promise = promise.then(
      function (pageNum) {
        return doc.getPage(pageNum).then(function (pdfPage) {
          // Create the page view.
          var pdfPageView = new pdfjsViewer.PDFPageView({
            container: container,
            id: pageNum,
            scale: DEFAULT_SCALE,
            defaultViewport: pdfPage.getViewport({ scale: DEFAULT_SCALE }),
            eventBus: eventBus,
            annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
            renderInteractiveForms: true,
          });

          pdfPage.getAnnotations().then((annotations) => {
            const routine = () => {

              annotations.forEach((annotation) => {
                let elem = document.getElementById(annotation.id);
                if (elem === null) {
                  return;
                }
                values[annotation.id] = '';
                annotation.elem = elem;
                annotation.elem.annotation = annotation;
                annotation.elem.addEventListener('change', changeHandler);
                annotation.elem.addEventListener('keyup', changeHandler);
                annotation.elem.style.border = "2px solid purple";


                // Demonstrating that you can prefill the fields
                if (annotation.id == '1574R') {
                  // Sets the value on the input (the PDF annotation)
                  annotation.elem.value = 'John P';
                  // Manually triggering a 'change' event so the changeHandler
                  // function runs and updates the JSON view
                  annotation.elem.dispatchEvent(new Event('change'));
                }
              });

              drawJSON();
            };

            setTimeout(routine, 1000);
          });

          // Associate the actual page with the view and draw it.
          pdfPageView.setPdfPage(pdfPage);
          return pdfPageView.draw();
        });
      }.bind(null, i)
    );
  }
});
