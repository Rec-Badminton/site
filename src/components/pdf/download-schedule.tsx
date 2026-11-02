import { pdf } from '@react-pdf/renderer';
import SchedulePdf, { type SchedulePdfProps } from '@/components/pdf/SchedulePdf';

// Renders the schedule PDF in the browser and hands it to the visitor as a file.
export async function downloadSchedulePdf(props: SchedulePdfProps): Promise<void> {
  const blob: Blob = await pdf(<SchedulePdf {...props} />).toBlob();
  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = `${props.t('pdf.schedule.filename')}.pdf`;
  link.click();
  // some browsers read the blob after click() returns
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
