"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ButtonProps } from "@/interface/common/ButtonProps";

export default function Button({
    type = "button",
    text,
    icon,
    title,
    route,
    textStyle,
    setOpenModal,
    buttonStyle,
    onClick,
    disabled,
    children,
}: ButtonProps & { children?: React.ReactNode }) {
    const router = useRouter();

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${buttonStyle}`}
            onClick={() => {
                if (route) router.push(route);
                if (setOpenModal) setOpenModal();
                if (onClick) onClick();
            }}
        >
            {icon && <span className={textStyle}>{icon}</span>}
            {text && <span className={textStyle}>{text}</span>}
            {title && <span className={textStyle}>{title}</span>}
            {children}
        </button>
    );
}
