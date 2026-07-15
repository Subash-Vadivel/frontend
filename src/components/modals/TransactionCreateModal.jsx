import TransactionForm from '../forms/TransactionForm.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog.jsx';

export default function TransactionCreateModal({ type, categories, onClose, onSubmit }) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>New entry</DialogDescription>
          <DialogTitle>Add {type}</DialogTitle>
        </DialogHeader>
        <TransactionForm type={type} categories={categories} onSubmit={onSubmit} heading={null} />
      </DialogContent>
    </Dialog>
  );
}
