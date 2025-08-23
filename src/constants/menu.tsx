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
        path: "/admin/residents",
      },
      {
        key: "family_cards",
        icon: <IdcardOutlined />,
        label: t("family card"),
        path: "/admin/family-cards",
      },
      {
        key: "employee",
        icon: <UsergroupAddOutlined />,
        label: t("employee"),
        path: "/admin/employees",
      },
      {
        key: "user",
        icon: <UserOutlined />,
        label: t("user"),
        path: "/admin/users",
      },
      {
        key: "role",
        icon: <SlidersOutlined />,
        label: t("role"),
        path: "/admin/roles",
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
        path: "/admin/incoming-letters",
      },
      {
        key: "outgoing-letter",
        icon: <MailOutlined />,
        label: t("outgoing letter"),
        path: "/admin/outgoing-letters",
      },
      {
        key: "submission-service",
        icon: <TagOutlined />,
        label: t("submission service"),
        path: "/admin/submission-services",
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
        path: "/admin/periods",
      },
      {
        key: "income",
        icon: <FundProjectionScreenOutlined />,
        label: t("income"),
        path: "/admin/incomes",
      },
      {
        key: "expend",
        icon: <WalletOutlined />,
        label: t("expend"),
        path: "/admin/expenses",
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
        path: "/admin/regions",
      },
      {
        key: "rw",
        icon: <ClusterOutlined />,
        label: t("rw.title"),
        path: "/admin/citizen-associations",
      },
      {
        key: "rt",
        icon: <HomeOutlined />,
        label: t("rt.title"),
        path: "/admin/neighborhood-associations",
      },
    ],
  },
  {
    title: t("menu title.village"),
    items: [
      {
        key: "stall",
        icon: <ShoppingCartOutlined />,
        label: t("stall"),
        path: "/admin/stall-village",
      },
      {
        key: "service",
        icon: <SwitcherOutlined />,
        label: t("service.title"),
        path: "/admin/services",
      },
      {
        key: "social-assistance",
        icon: <IdcardOutlined />,
        label: t("social_assistance.title"),
        path: "/admin/social-assistances",
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
        path: "/admin/developments",
      },
      {
        key: "report",
        icon: <ProfileOutlined />,
        label: t("report"),
        path: "/admin/reports",
      },
      {
        key: "activities",
        icon: <ActivityIcon />,
        label: t("activity.title"),
        path: "/admin/activities",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        key: "news",
        icon: <BookOutlined />,
        label: t("news"),
        path: "/admin/news",
      },
      {
        key: "village",
        icon: <BankOutlined />,
        label: t("village"),
        path: "/admin/villages",
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
