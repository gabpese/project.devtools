import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

function ActionTooltip({
    content,
    children,
    preferredPlacement = "top"
}) {
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        placement: preferredPlacement
    });

    function getBestPlacement(triggerRect, tooltipRect, preferred) {
        const spacing = 12;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const spaceTop = triggerRect.top;
        const spaceBottom = viewportHeight - triggerRect.bottom;
        const spaceLeft = triggerRect.left;
        const spaceRight = viewportWidth - triggerRect.right;

        const fitsTop = spaceTop >= tooltipRect.height + spacing;
        const fitsBottom = spaceBottom >= tooltipRect.height + spacing;
        const fitsLeft = spaceLeft >= tooltipRect.width + spacing;
        const fitsRight = spaceRight >= tooltipRect.width + spacing;

        const orderMap = {
            top: ["top", "bottom", "right", "left"],
            bottom: ["bottom", "top", "right", "left"],
            right: ["right", "left", "top", "bottom"],
            left: ["left", "right", "top", "bottom"]
        };

        const order = orderMap[preferred] || orderMap.top;

        for (const placement of order) {
            if (placement === "top" && fitsTop) {
                return "top";
            }

            if (placement === "bottom" && fitsBottom) {
                return "bottom";
            }

            if (placement === "left" && fitsLeft) {
                return "left";
            }

            if (placement === "right" && fitsRight) {
                return "right";
            }
        }

        const candidates = [
            { placement: "top", space: spaceTop },
            { placement: "bottom", space: spaceBottom },
            { placement: "left", space: spaceLeft },
            { placement: "right", space: spaceRight }
        ];

        candidates.sort((a, b) => b.space - a.space);
        return candidates[0].placement;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function updatePosition() {
        if (!triggerRef.current || !tooltipRef.current) {
            return;
        }

        const spacing = 12;
        const edgePadding = 8;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const placement = getBestPlacement(triggerRect, tooltipRect, preferredPlacement);

        let top = 0;
        let left = 0;

        if (placement === "top") {
            top = triggerRect.top - tooltipRect.height - spacing;
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        }

        if (placement === "bottom") {
            top = triggerRect.bottom + spacing;
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        }

        if (placement === "left") {
            top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
            left = triggerRect.left - tooltipRect.width - spacing;
        }

        if (placement === "right") {
            top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
            left = triggerRect.right + spacing;
        }

        const maxLeft = window.innerWidth - tooltipRect.width - edgePadding;
        const maxTop = window.innerHeight - tooltipRect.height - edgePadding;

        setPosition({
            top: clamp(top, edgePadding, Math.max(edgePadding, maxTop)),
            left: clamp(left, edgePadding, Math.max(edgePadding, maxLeft)),
            placement
        });
    }

    useLayoutEffect(() => {
        if (!isOpen) {
            return;
        }

        updatePosition();
    }, [isOpen, content, preferredPlacement]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleWindowChange() {
            updatePosition();
        }

        window.addEventListener("resize", handleWindowChange);
        window.addEventListener("scroll", handleWindowChange, true);

        return () => {
            window.removeEventListener("resize", handleWindowChange);
            window.removeEventListener("scroll", handleWindowChange, true);
        };
    }, [isOpen, content, preferredPlacement]);

    return (
        <span
            ref={triggerRef}
            className="action-tooltip-trigger"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
        >
            {children}

            {isOpen && content ? (
                <span
                    ref={tooltipRef}
                    className={`action-tooltip action-tooltip--${position.placement}`}
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`
                    }}
                    role="tooltip"
                    aria-hidden={!isOpen}
                >
                    {content}
                </span>
            ) : null}
        </span>
    );
}

export default ActionTooltip;