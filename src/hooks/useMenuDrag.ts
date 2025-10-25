import { useState, useEffect } from 'react';

export function useMenuDrag() {
	const [isDragging, setIsDragging] = useState(false);
	const [dragStartY, setDragStartY] = useState(0);
	const [menuDragY, setMenuDragY] = useState(0);

	const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
		event.preventDefault();
		setIsDragging(true);
		const clientY =
			'touches' in event ? event.touches[0].clientY : event.clientY;
		setDragStartY(clientY);
		setMenuDragY(0);
	};

	const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
		if (!isDragging) return;
		event.preventDefault();

		const clientY =
			'touches' in event ? event.touches[0].clientY : event.clientY;
		const deltaY = clientY - dragStartY;

		// Only allow dragging down
		if (deltaY > 0) {
			setMenuDragY(deltaY);
		}
	};

	const handleDragEnd = () => {
		if (!isDragging) return;

		setIsDragging(false);
		setMenuDragY(0);
		setDragStartY(0);
	};

	// Add global event listeners for drag
	useEffect(() => {
		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				const deltaY = e.clientY - dragStartY;
				if (deltaY > 0) {
					setMenuDragY(deltaY);
				}
			}
		};

		const handleGlobalMouseUp = () => {
			if (isDragging) {
				handleDragEnd();
			}
		};

		const handleGlobalTouchMove = (e: TouchEvent) => {
			if (isDragging) {
				e.preventDefault();
				const deltaY = e.touches[0].clientY - dragStartY;
				if (deltaY > 0) {
					setMenuDragY(deltaY);
				}
			}
		};

		const handleGlobalTouchEnd = () => {
			if (isDragging) {
				handleDragEnd();
			}
		};

		if (isDragging) {
			document.addEventListener('mousemove', handleGlobalMouseMove);
			document.addEventListener('mouseup', handleGlobalMouseUp);
			document.addEventListener('touchmove', handleGlobalTouchMove, {
				passive: false,
			});
			document.addEventListener('touchend', handleGlobalTouchEnd);
		}

		return () => {
			document.removeEventListener('mousemove', handleGlobalMouseMove);
			document.removeEventListener('mouseup', handleGlobalMouseUp);
			document.removeEventListener('touchmove', handleGlobalTouchMove);
			document.removeEventListener('touchend', handleGlobalTouchEnd);
		};
	}, [isDragging, dragStartY]);

	return {
		isDragging,
		menuDragY,
		handleDragStart,
		handleDragMove,
		handleDragEnd,
	};
}
