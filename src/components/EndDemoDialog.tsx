import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface EndDemoDialogProps {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function EndDemoDialog({
	open,
	onConfirm,
	onCancel,
}: EndDemoDialogProps) {
	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
			<DialogContent
				hideCloseButton
				className="sm:max-w-[425px] bg-white border-red-200 rounded-2xl p-6 gap-0"
			>
				<DialogTitle className="sr-only">Kết thúc Demo</DialogTitle>
				<DialogDescription className="sr-only">
					Xác nhận kết thúc Demo và xóa tất cả dữ liệu
				</DialogDescription>

				{/* Icon Warning */}
				<div className="flex justify-center mb-4">
					<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
						<AlertTriangle className="w-8 h-8 text-red-600" />
					</div>
				</div>

				{/* Title */}
				<h2 className="text-xl font-semibold text-[#3E2723] text-center mb-2">
					Kết thúc Demo
				</h2>

				{/* Description */}
				<p className="text-sm text-[#8B7355] text-center mb-6">
					Bạn có chắc chắn muốn kết thúc Demo? Tất cả dữ liệu trong localStorage
					sẽ bị xóa, bao gồm:
				</p>

				{/* List items to be deleted */}
				<div className="bg-red-50 rounded-xl p-4 mb-6 space-y-2">
					<div className="flex items-center gap-2 text-sm text-[#3E2723]">
						<Trash2 className="w-4 h-4 text-red-600" />
						<span>Lịch sử chat</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-[#3E2723]">
						<Trash2 className="w-4 h-4 text-red-600" />
						<span>Số lượng khách đã chọn</span>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					<Button
						onClick={onCancel}
						variant="outline"
						className="flex-1 h-12 rounded-xl border-[#C4941D] text-[#3E2723] hover:bg-[#FFF4E0]"
					>
						<X className="w-4 h-4 mr-2" />
						Hủy
					</Button>
					<Button
						onClick={onConfirm}
						className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg"
					>
						<Trash2 className="w-4 h-4 mr-2" />
						Xác nhận xóa
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
