console.log("working..");

const getValuesById = (id) => {
  return document.getElementById(id).value;
};

function downloadPDF(buffer, filename) {
  // Create a new Blob object from the buffer data
  const blob = new Blob([buffer], { type: "application/pdf" });

  // Create a link element
  const link = document.createElement("a");

  // Set the href attribute of the link to the Blob object
  link.href = URL.createObjectURL(blob);

  // Set the download attribute to specify the filename
  link.download = filename;

  // Append the link to the document body
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document body
  document.body.removeChild(link);
}

const handleSubmit = async () => {
  const pdfFile = await (await fetch("./simple-form.pdf")).arrayBuffer();

  const pdfDoc = await PDFLib.PDFDocument.load(pdfFile);
  // console.log("PDF DOC>>>", pdfDoc);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  fields.forEach((field) => {
    const type = field.name;
    const name = field.getName();
    console.log(`${type}: ${name}`);
  });

  const applicationDateValue = getValuesById("application_date");
  const applicationDate = form.getTextField("applicationDate");
  applicationDate.setText(applicationDateValue);

  const trackingIDValue = getValuesById("tracker_id");
  const trackingId = form.getTextField("trackerId");
  trackingId.setText(trackingIDValue);

  let radioBtnValue;
  document.querySelectorAll("[name=application]").forEach((item) => {
    const isChecked = item.checked;
    console.log("checked", isChecked, item.value);
    if (isChecked) {
      radioBtnValue = item.value;
    }
  });

  const applicationType = form.getRadioGroup("applicationTypeGroup");
  const options = applicationType.getOptions();
  console.log("aptype options", options);
  applicationType.select(radioBtnValue || options[0]);

  /*  const accountNumberValue = getValuesById("account_no");
  const customerIDValue = getValuesById("Customer_id");
  console.log("Values", { accountNumberValue, customerIDValue });
  const accNumber = form.getTextField("customerId");
  accNumber.setText(customerIDValue);
  const customNumber = form.getTextField("accountNumber");
  customNumber.setText(accountNumberValue); */

  const outBuffer = await pdfDoc.save();
  downloadPDF(outBuffer, "updated-form-1");
};

document.addEventListener("DOMContentLoaded", () => {
  const btnEle = document.querySelector("[name=submit]");
  btnEle.addEventListener("click", handleSubmit);
});
