import QRCode from "qrcode"
import { customAlphabet } from "nanoid"

const generateUniqueCode = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 8)

interface Product {
  partName: string
  partNumber: string
  unit: string
}

interface LabelItem {
  customerName?: string
  customer?: string
  product: Product
  noLotSpk: string
  qty: number
  totalQty?: number
  packingDate?: string
  showPackingDate: boolean
  inspector: string
  labelCount?: number
}

export const LABEL_CSS = `
  @media print {
    @page { 
      size: 21cm 34cm; 
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
      padding: 4mm 10mm !important;
    }
  }
  body { 
    font-family: 'Calibri Light', Calibri, sans-serif;
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
    grid-auto-rows: calc(26mm - 6px);
    gap: 18.7px 16px; 
    padding: 5mm 0mm;
    box-sizing: border-box;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    justify-content: center;
    overflow: hidden;
  }
  .label-container { 
    border: 0.5px solid #000; 
    width: calc(65mm - 16px); 
    height: calc(26mm - 6px); 
    box-sizing: border-box; 
    overflow: hidden; 
    page-break-inside: avoid; 
    border-radius: 1mm; 
    position: relative;
  }
  .header { text-align: center; font-weight: 800; border-bottom: 0.05px solid #000; padding: 0.4px 2px; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.1; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  td { border: 0.15px solid #000; padding: 0.55px 2px; font-size: 8px; vertical-align: middle; overflow: hidden; white-space: nowrap; line-height: 1.05; }
  .label-cell { width: 18.5mm; font-weight: bold; font-size: 8px; }
  .auto-fit { white-space: nowrap; overflow: hidden; display: block; width: 100%; font-size: 8.5px; font-weight: bold; line-height: 1.05; }
  .qr-cell { width: 14mm; border-left: 0.05px solid #000; text-align: center; padding: 1px; vertical-align: middle; }
  .qr-cell img { width: 12mm; height: 12mm; margin: 0 auto; display: block; image-rendering: pixelated; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
  .qr-cell-honda { 
    width: 12mm; 
    border-left: 0.15px solid #000; 
    text-align: center; 
    vertical-align: middle; 
    padding: 0.5px;
  }
  .qr-cell-honda img { width: 11.2mm; height: 11.2mm; margin: 0 auto; display: block; image-rendering: pixelated; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
  .honda-table td { padding: 0.55px 2px; }
  .checkboxes { display: flex; gap: 1px; align-items: center; }
  .check-item { display: flex; align-items: center; gap: 0.5mm; }
  .box { 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    width: 3.5mm; 
    height: 2.2mm; 
    border: 0.3px solid #000; 
    font-size: 6.5px; 
    font-weight: bold;
    line-height: 1;
  }
  .box.checked { border-width: 0.5px; }
`

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[parseInt(month) - 1];
  return `${day}-${monthName}-${year}`;
};

export const renderHondaLabelHtml = (item: LabelItem, qrDataUrl: string) => {
  const receiver = item.customerName?.trim() || "PT. ASTRA HONDA MOTOR"
  return `
    <div class="label-container">
      <div class="header">PT. GRAFINDO MITRASEMESTA</div>
      <table class="honda-table">
        <tr>
          <td class="label-cell">Nama Part</td>
          <td style="border-right: none;"><div class="auto-fit">: ${item.product.partName}</div></td>
          <td rowspan="4" class="qr-cell-honda">
             <img src="${qrDataUrl}" alt="QR Code" style="width: 11.2mm; height: 11.2mm; display: block; margin: 0 auto; image-rendering: pixelated;" />
          </td>
        </tr>
        <tr>
          <td class="label-cell">No. Part</td>
          <td style="border-right: none;"><div class="auto-fit">: ${item.product.partNumber}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Penerima</td>
          <td style="border-right: none;"><div class="auto-fit">: ${receiver}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Lot Produksi</td>
          <td style="border-right: none;"><div class="auto-fit">: ${item.noLotSpk}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Quantity</td>
          <td colspan="2"><div class="auto-fit">: ${item.qty} ${item.product.unit}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Tgl. Packing</td>
          <td colspan="2"><div class="auto-fit">: ${item.showPackingDate ? formatDate(item.packingDate) : ""}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Inspector</td>
          <td colspan="2">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; line-height: 1;">
              <span style="font-weight: bold; font-size: 8px;">: ${item.inspector}</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-weight: bold; font-size: 7.5px;">Status Part:</span>
                <span class="box checked">OK</span>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `
}

export const renderLabelHtml = (item: LabelItem, qrDataUrl: string) => {
  const receiver = item.customerName?.trim() || "PT. YAMAHA INDONESIA MOTOR MFG"
  // Existing Yamaha Label
  return `
    <div class="label-container">
      <div class="header">PT. GRAFINDO MITRASEMESTA</div>
      <table>
        <tr>
          <td class="label-cell">Part Name</td>
          <td colspan="2"><div class="auto-fit">: ${item.product.partName}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Part Number</td>
          <td colspan="2"><div class="auto-fit">: ${item.product.partNumber}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Penerima</td>
          <td colspan="2"><div class="auto-fit">: ${receiver}</div></td>
        </tr>
        <tr>
          <td class="label-cell">No. Lot</td>
          <td style="border-right: none;"><div class="auto-fit">: ${item.noLotSpk}</div></td>
          <td rowspan="4" class="qr-cell">
             <div style="display: flex; justify-content: center;">
               <img src="${qrDataUrl}" alt="QR Code" style="width: 12mm; height: 12mm; display: block; margin: 0 auto; image-rendering: pixelated;" />
             </div>
          </td>
        </tr>
        <tr>
          <td class="label-cell">Qty</td>
          <td style="border-right: none;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: bold; font-size: 8.5px;">: ${item.qty} ${item.product.unit}</span>
              <div class="checkboxes">
                <div class="check-item"><span class="box checked">OK</span></div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="label-cell">Tgl. Packing</td>
          <td style="border-right: none;"><div class="auto-fit">: ${item.showPackingDate ? formatDate(item.packingDate) : ""}</div></td>
        </tr>
        <tr>
          <td class="label-cell">Opr. Packing</td>
          <td style="border-right: none;"><div class="auto-fit">: ${item.inspector}</div></td>
        </tr>
      </table>
    </div>
  `
}

export async function printLabels(items: LabelItem[]) {
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

      const series = String(i + 1).padStart(3, '0')
      const uniqueCode = generateUniqueCode()

      let specificBarcode = ""
      if (item.customer === "Honda") {
        specificBarcode = `${item.product.partNumber}|1201591|${currentQty}|${item.noLotSpk}-${series}|${uniqueCode}`
      } else {
        specificBarcode = `${item.product.partNumber} ${currentQty} ${item.noLotSpk}-${series} ${uniqueCode}`
      }

      const qrDataUrl = await QRCode.toDataURL(specificBarcode, {
        width: 300,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#ffffff' }
      })

      const labelItem = { ...item, qty: currentQty }

      if (item.customer === "Honda") {
        allLabelsHtml += renderHondaLabelHtml(labelItem, qrDataUrl)
      } else {
        allLabelsHtml += renderLabelHtml(labelItem, qrDataUrl)
      }
    }
  }

  printWindow.document.write(`
    <html>
      <head>
        <title></title>
        <style>${LABEL_CSS}</style>
      </head>
      <body>
        <div class="page-container">
          ${allLabelsHtml}
        </div>
        <script>
          function fitText() {
            document.querySelectorAll('.auto-fit').forEach(function(el) {
              let size = parseFloat(window.getComputedStyle(el).fontSize);
              while (el.scrollWidth > el.clientWidth && size > 4.5) {
                size -= 0.15;
                el.style.fontSize = size + 'px';
              }
            });
          }
          window.onload = () => {
            fitText();
            setTimeout(() => {
              window.print();
              window.onafterprint = () => window.close();
            }, 50);
          }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

