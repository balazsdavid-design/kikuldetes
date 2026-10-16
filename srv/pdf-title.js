const { PDFDocument } = require("pdf-lib");

async function setPostingPDFTitle(value, posting, kind) {
    // Service validation errors share the PDF response; leave them untouched.
    if (typeof value !== "string") return value;
    const bytes = Buffer.from(value, "base64");
    if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") return value;

    const type = kind === "Car" ? "Autós kiküldetés" : "Kiküldetés";
    const employeeName = [posting.employee?.lastName, posting.employee?.name]
        .filter(Boolean).join(" ").trim();
    const name = posting.goal?.trim() || employeeName;
    const title = name ? `${type} – ${name}` : type;
    const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
    // The native browser viewer reads the PDF title, not the UI5 viewer title.
    pdf.setTitle(title, { showInWindowTitleBar: true });
    // Preserve the generated form's existing appearance streams and XFA data.
    return pdf.saveAsBase64({ updateFieldAppearances: false });
}

module.exports = { setPostingPDFTitle };
