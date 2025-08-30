import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";

interface NextProps {
  setStep: Dispatch<SetStateAction<string>>;
  navigate: NavigateFunction;
  value: string;
}

export const handleChangeStep = ({ navigate, setStep, value }: NextProps) => {
  const query = new URLSearchParams();
  query.set("step", value);
  setStep(value);
  navigate({ search: query.toString() });
};
