// ModalTrigerProps.ts
import { Dispatch, SetStateAction } from "react";

export interface ModalTrigerProps {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}
