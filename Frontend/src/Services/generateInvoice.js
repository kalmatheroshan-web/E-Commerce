import html2pdf from "html2pdf.js";

const generateInvoicePDF = async ({
    element,
    filename = "invoice.pdf",
}) => {
    if (!element) return;

    const options = {
        margin: 0.2,

        filename,

        image: {
            type: "jpeg",
            quality: 1,
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,

            onclone: (clonedDoc) => {
                // REMOVE ALL TAILWIND STYLESHEETS
                const links =
                    clonedDoc.querySelectorAll(
                        'link[rel="stylesheet"]'
                    );

                links.forEach((link) => {
                    link.remove();
                });

                // APPLY SAFE INLINE STYLES
                const invoice =
                    clonedDoc.getElementById("invoice-pdf");

                if (invoice) {
                    invoice.style.background = "#ffffff";
                    invoice.style.color = "#000000";
                    invoice.style.fontFamily = "Arial, sans-serif";
                }

                // FIX ALL ELEMENT COLORS
                const all =
                    clonedDoc.querySelectorAll("*");

                all.forEach((el) => {
                    el.style.color =
                        el.style.color || "#000000";

                    el.style.borderColor =
                        el.style.borderColor || "#d1d5db";

                    el.style.backgroundColor =
                        el.style.backgroundColor || "transparent";
                });
            },
        },

        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
        },
    };

    try {
        await html2pdf()
            .set(options)
            .from(element)
            .save();
    } catch (error) {
        console.error(
            "PDF generation failed:",
            error
        );
    }
};

export default generateInvoicePDF;