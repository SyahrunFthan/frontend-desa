interface PropsItem {
  key: string;
  value?: object | string | null | boolean;
}

export const setItem = ({ key, value }: PropsItem) => {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getItem = (key: string): any => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage`, error);
    return null;
  }
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
