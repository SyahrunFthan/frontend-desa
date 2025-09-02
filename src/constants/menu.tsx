import {
  BankOutlined,
  BookOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  IdcardOutlined,
  MailFilled,
  MailOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SwitcherOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  DollarCircleOutlined,
  ProfileOutlined,
  SlidersOutlined,
  UserOutlined,
  TagOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  WalletOutlined,
  CalendarOutlined,
  HomeOutlined,
  ClusterOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import type { TFunction } from "i18next";
import type { Item } from "../models/global";
import { ActivityIcon } from "lucide-react";

export const menuItems = (t: TFunction): Item[] => [
  {
    items: [
      {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: t("dashboard"),
        path: "/admin/dashboard",
      },
    ],
  },
  {
    title: t("menu title.user"),
    items: [
      {
        key: "resident",
        icon: <TeamOutlined />,
        label: t("resident"),
        path: "/admin/resident",
      },
      {
        key: "family_cards",
        icon: <IdcardOutlined />,
        label: t("family card"),
        path: "/admin/family-card",
      },
      {
        key: "employee",
        icon: <UsergroupAddOutlined />,
        label: t("employee.title"),
        path: "/admin/employee",
      },
      {
        key: "user",
        icon: <UserOutlined />,
        label: t("user"),
        path: "/admin/user",
      },
      {
        key: "role",
        icon: <SlidersOutlined />,
        label: t("role"),
        path: "/admin/role",
      },
    ],
  },
  {
    title: t("menu title.letter"),
    items: [
      {
        key: "incoming-letter",
        icon: <MailFilled />,
        label: t("incoming letter"),
        path: "/admin/incoming-letter",
      },
      {
        key: "outgoing-letter",
        icon: <MailOutlined />,
        label: t("outgoing letter"),
        path: "/admin/outgoing-letter",
      },
      {
        key: "submission-service",
        icon: <TagOutlined />,
        label: t("submissionService.title"),
        path: "/admin/submission-service",
      },
    ],
  },
  {
    title: t("menu title.apbdes"),
    items: [
      {
        key: "periods",
        icon: <CalendarOutlined />,
        label: t("periods"),
        path: "/admin/period",
      },
      {
        key: "income",
        icon: <FundProjectionScreenOutlined />,
        label: t("income"),
        path: "/admin/income",
      },
      {
        key: "expend",
        icon: <WalletOutlined />,
        label: t("expend"),
        path: "/admin/expense",
      },
    ],
  },
  {
    title: t("menu title.region"),
    items: [
      {
        key: "map",
        icon: <EnvironmentOutlined />,
        label: t("region.title"),
        path: "/admin/region",
      },
      {
        key: "rw",
        icon: <ClusterOutlined />,
        label: t("rw.title"),
        path: "/admin/citizen-association",
      },
      {
        key: "rt",
        icon: <HomeOutlined />,
        label: t("rt.title"),
        path: "/admin/neighborhood-association",
      },
      {
        key: "facility",
        icon: <BuildOutlined />,
        label: t("facility.title"),
        path: "/admin/facility",
      },
    ],
  },
  {
    title: t("menu title.village"),
    items: [
      {
        key: "stall",
        icon: <ShoppingCartOutlined />,
        label: t("stall.title"),
        path: "/admin/stall-village",
      },
      {
        key: "service",
        icon: <SwitcherOutlined />,
        label: t("service.title"),
        path: "/admin/service",
      },
      {
        key: "social-assistance",
        icon: <IdcardOutlined />,
        label: t("social_assistance.title"),
        path: "/admin/social-assistance",
      },
      {
        key: "tax",
        icon: <DollarCircleOutlined />,
        label: t("tax.title"),
        path: "/admin/taxes",
      },
      {
        key: "development",
        icon: <ToolOutlined />,
        label: t("development.title"),
        path: "/admin/development",
      },
      {
        key: "report",
        icon: <ProfileOutlined />,
        label: t("report"),
        path: "/admin/report",
      },
      {
        key: "activities",
        icon: <ActivityIcon />,
        label: t("activity.title"),
        path: "/admin/activity",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        key: "news",
        icon: <BookOutlined />,
        label: t("news.title"),
        path: "/admin/news",
      },
      {
        key: "village",
        icon: <BankOutlined />,
        label: t("village.title"),
        path: "/admin/village",
      },
      {
        key: "change-password",
        icon: <SettingOutlined />,
        label: t("change password"),
        path: "/admin/change-password",
      },
    ],
  },
];

export const menuMainItems: Item[] = [
  {
    items: [
      {
        key: "home",
        icon: <HomeOutlined />,
        label: "Beranda",
        path: "/",
      },
      {
        key: "check_bansos",
        icon: <ActivityIcon />,
        label: "Cek Bansos",
        path: "/check-social-assistance",
      },
      {
        key: "statistic",
        icon: <ActivityIcon />,
        label: "Statistik Desa",
        path: "/statistic",
      },
      {
        key: "stall_village",
        icon: <ActivityIcon />,
        label: "Lapak Desa",
        path: "/stall-village",
      },
      {
        key: "map_village",
        icon: <ActivityIcon />,
        label: "Peta Desa",
        path: "/maps",
      },
      {
        key: "abdes",
        icon: <ActivityIcon />,
        label: "APBDes",
        path: "/stall-village",
      },
      {
        key: "profile_village",
        icon: <ActivityIcon />,
        label: "Profil Desa",
        path: "/stall-village",
      },
      {
        key: "terms_and_conditions",
        icon: <ActivityIcon />,
        label: "Syarat & Kebijakan",
        path: "/terms",
      },
    ],
  },
];
