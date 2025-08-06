import { Button, Dropdown, type MenuProps } from "antd";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import i18n from "i18next";
import { useEffect, useState } from "react";
import { getItem, setItem } from "../../helpers/storage";

interface Props {
  onChangeAntdLocale: (locale: typeof enUS | typeof idID) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ onChangeAntdLocale }) => {
  const [currentLang, setCurrentLang] = useState<"id" | "en">("id");

  useEffect(() => {
    const savedLang = getItem("locale") ?? "id";

    setCurrentLang(savedLang);
    i18n.changeLanguage(savedLang);
    onChangeAntdLocale(savedLang === "en" ? enUS : idID);
  }, []);

  const handleChange = (lang: "id" | "en") => {
    setItem({
      key: "locale",
      value: lang,
    });
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    onChangeAntdLocale(lang === "en" ? enUS : idID);
  };

  const items: MenuProps["items"] = [
    {
      key: "id",
      label: "🇮🇩 Bahasa Indonesia",
      onClick: () => handleChange("id"),
    },
    {
      key: "en",
      label: "🇬🇧 English",
      onClick: () => handleChange("en"),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <Button className="flex items-center" shape="circle">
        {currentLang.toUpperCase()}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
