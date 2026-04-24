import QRCode from "qrcode"

export const LABEL_CSS = `
  @media print {
    @page { 
      size: A4; 
      margin: 0 !important; 
    }
    body { 
      margin: 0 !important; 
      padding: 0 !important;
      background: white !important;
      -webkit-print-color-adjust: exact;
    }
    .page-container {
      box-shadow: none !important;
      padding: 5mm 5mm 5mm 15mm !important;
      justify-content: start !important;
    }
  }
  body { 
    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
    background: #f1f5f9;
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  .page-container { 
    background: white;
    width: 210mm; 
    height: auto;
    display: grid; 
    grid-template-columns: repeat(3, calc(65mm - 16px)); 
    grid-auto-rows: 26mm;
    gap: 17.3px; 
    padding: 5mm 0mm;
    box-sizing: border-box;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    justify-content: center;
    overflow: hidden;
  }
  .label-container { 
    border: 0.5px solid #000; 
    width: calc(65mm - 16px); 
    height: 26mm; 
    box-sizing: border-box; 
    overflow: hidden; 
    page-break-inside: avoid; 
    border-radius: 1mm; 
    position: relative;
  }
  .header { text-align: center; font-weight: 800; border-bottom: 0.05px solid #000; padding: 2px; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  td { border: 0.15px solid #000; padding: 0.8px 2px; font-size: 7.5px; vertical-align: middle; overflow: hidden; white-space: nowrap; line-height: 1.1; }
  .label-cell { width: 19mm; font-weight: bold; }
  .qr-cell { width: 15mm; border-left: 0.05px solid #000; text-align: center; padding: 1px; vertical-align: middle; }
  .qr-cell svg { width: 11.5mm; height: 11.5mm; }
  .qr-cell-honda { 
    width: 15mm; 
    border-left: 0.15px solid #000; 
    text-align: center; 
    vertical-align: middle; 
    padding: 1px;
  }
  .qr-cell-honda svg { width: 12mm; height: 12mm; }
  .honda-table td { height: 3.2mm; padding: 0.5px 2px; }
  .checkboxes { display: flex; gap: 1px; align-items: center; }
  .check-item { display: flex; align-items: center; gap: 0.5mm; }
  .box { 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    width: 3.5mm; 
    height: 2.2mm; 
    border: 0.3px solid #000; 
    font-size: 4px; 
    font-weight: bold;
    line-height: 1;
  }
  .box.checked { border-width: 0.5px; }
`

export const renderHondaLabelHtml = (item: any, qrSvg: string) => {
  return `
    <div class="label-container">
      <div class="header">PT. GRAFINDO MITRASEMESTA</div>
      <table class="honda-table">
        <tr>
          <td class="label-cell">Nama Part</td>
          <td style="border-right: none;">: ${item.product.partName}</td>
          <td rowspan="3" class="qr-cell-honda">
             ${qrSvg}
          </td>
        </tr>
        <tr>
          <td class="label-cell">No. Part</td>
          <td style="border-right: none;">: ${item.product.partNumber}</td>
        </tr>
        <tr>
          <td class="label-cell">Lot Produksi</td>
          <td style="border-right: none;">: ${item.noLotSpk}</td>
        </tr>
        <tr>
          <td class="label-cell">Quantity</td>
          <td colspan="2">: ${item.qty} ${item.product.unit}</td>
        </tr>
        <tr>
          <td class="label-cell">Tgl. Packing</td>
          <td colspan="2">: ${new Date(item.createdAt).toLocaleString("id-ID", { hour12: true })}</td>
        </tr>
        <tr>
          <td class="label-cell">Inspector</td>
          <td colspan="2">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>: ${item.inspector}</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 7.5px;">Status Part:</span>
                <span class="box checked">OK</span>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `
}

export const renderLabelHtml = (item: any, qrSvg: string) => {
  // Existing Yamaha Label
  return `
    <div class="label-container">
      <div class="header">PT. GRAFINDO MITRASEMESTA</div>
      <table>
        <tr>
          <td class="label-cell">Part Name</td>
          <td colspan="2">: ${item.product.partName}</td>
        </tr>
        <tr>
          <td class="label-cell">Part Number</td>
          <td colspan="2">: ${item.product.partNumber}</td>
        </tr>
        <tr>
          <td class="label-cell">Penerima</td>
          <td colspan="2">: PT. YAMAHA INDONESIA MOTOR MFG</td>
        </tr>
        <tr>
          <td class="label-cell">No. Lot</td>
          <td style="border-right: none;">: ${item.noLotSpk}</td>
          <td rowspan="4" class="qr-cell">
             <div style="display: flex; justify-content: center;">
               ${qrSvg}
             </div>
          </td>
        </tr>
        <tr>
          <td class="label-cell">Qty</td>
          <td style="border-right: none;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>: ${item.qty} ${item.product.unit}</span>
              <div class="checkboxes">
                <div class="check-item"><span class="box checked">OK</span></div>
                <div class="check-item"><span class="box">NG</span></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="label-cell">Tgl. Packing</td>
          <td style="border-right: none;">: ${new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
        </tr>
        <tr>
          <td class="label-cell">Opr. Packing</td>
          <td style="border-right: none;">: ${item.inspector}</td>
        </tr>
      </table>
    </div>
  `
}

export async function printLabels(items: any[]) {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  let allLabelsHtml = ""

  for (const item of items) {
    const labelCount = item.labelCount || 1
    const qtyPerLabel = item.qty
    const totalQty = item.totalQty || (qtyPerLabel * labelCount)

    for (let i = 0; i < labelCount; i++) {
      const currentQty = (i === labelCount - 1)
        ? (totalQty % qtyPerLabel || qtyPerLabel)
        : qtyPerLabel

      let specificBarcode = ""
      if (item.customer === "Honda") {
        specificBarcode = `${item.product.partNumber}|1201591|${currentQty}|${item.noLotSpk}`
      } else {
        specificBarcode = `${item.product.partNumber} ${currentQty} ${item.noLotSpk}`
      }

      const qrSvg = await QRCode.toString(specificBarcode, {
        type: 'svg',
        margin: 0,
        width: item.customer === "Honda" ? 64 : 128,
        color: { dark: '#000000', light: '#ffffff' }
      })

      const labelItem = { ...item, qty: currentQty }

      if (item.customer === "Honda") {
        allLabelsHtml += renderHondaLabelHtml(labelItem, qrSvg)
      } else {
        allLabelsHtml += renderLabelHtml(labelItem, qrSvg)
      }
    }
  }

  printWindow.document.write(`
    <html>
      <head>
        <title></title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
        <style>${LABEL_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${allLabelsHtml}
        </div>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
