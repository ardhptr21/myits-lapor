import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type Props = {
  onDelete: () => void;
  isDeleting?: boolean;
  triggerLabel?: string;
};

export default function ReportDeleteDialog({
  onDelete,
  isDeleting = false,
  triggerLabel = 'Hapus Laporan',
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{triggerLabel}</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus laporan?</AlertDialogTitle>
          <AlertDialogDescription>
            Laporan akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
