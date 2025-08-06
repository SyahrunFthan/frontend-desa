import axios, { AxiosError } from "axios";
import type { RoleModel } from "../models/role";
import type { UserForm, UserUpdateForm } from "../models/user";
import type { QueryParams } from "../models/global";
import type { AuthForm } from "../models/auth";
import { getItem, removeItem, setItem } from "../helpers/storage";
import { jwtDecode } from "jwt-decode";
import type { FamilyCardModel } from "../models/familyCard";

const API = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

API.interceptors.request.use(
  async (req) => {
    const profile = getItem("profile");
    const locale = getItem("locale") || "id";
    req.headers["Accept-Language"] = locale;
    if (profile?.token) {
      const currentDate = new Date();
      const isExpired =
        profile?.expire && profile.expire * 1000 < currentDate.getTime();

      if (isExpired) {
        try {
          const response = await axios.get(
            "http://localhost:5001/auth/refresh-token"
          );

          const newToken = response.data.accessToken;
          const decoded = jwtDecode(newToken);
          setItem({
            key: "profile",
            value: {
              token: newToken,
              expire: decoded?.exp,
            },
          });
          req.headers.Authorization = `Bearer ${response?.data?.accessToken}`;
        } catch (error) {
          const err = error as AxiosError;
          if (err?.response?.status == 401) {
            removeItem("profile");
            window.location.href = "/auth/login";
          } else {
            console.log(err);
          }
        }
      } else {
        req.headers.Authorization = `Bearer ${profile?.token}`;
      }
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (data: AuthForm) => {
  return API.post("/auth/login", data);
};
export const logout = () => {
  return API.delete("/auth/logout");
};

// Role
export const getRole = (pageSize: number, current: number) => {
  return API.get(`/role?page_size=${pageSize}&page=${current}`);
};
export const deleteRole = (id: string) => {
  return API.delete(`/role/${id}`);
};
export const createRole = (data: RoleModel) => {
  return API.post("/role", data);
};
export const updateRole = (id: string, data: RoleModel) => {
  return API.put(`/role/${id}`, data);
};

// User
export const getUser = ({ pageSize, current, filters = {} }: QueryParams) => {
  const params = new URLSearchParams();

  params.set("page_size", String(pageSize));
  params.set("page", String(current));

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, value);
    }
  });
  return API.get(`/user?${params.toString()}`);
};
export const createUser = (data: UserForm) => {
  return API.post("/user", data);
};
export const deleteUser = (id: string) => {
  return API.delete(`/user/${id}`);
};
export const updateUser = (id: string, data: UserUpdateForm) => {
  return API.put(`/user/${id}`, data);
};

// Family Card
export const getFamilyCard = ({
  pageSize,
  current,
  filters = {},
}: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page_size", String(pageSize));
  params.set("page", String(current));
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, value);
    }
  });

  return API.get(`/family-card?${params.toString()}`);
};
export const getFamilyCardId = ({ current, pageSize, id }: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page_size", String(pageSize));
  params.set("page", String(current));

  return API.get(`/family-card/${id}?${params.toString()}`);
};
export const deleteFamilyCard = (id: string) => {
  return API.delete(`/family-card/${id}`);
};
export const createFamilyCard = (data: Omit<FamilyCardModel, "id">) => {
  return API.post("/family-card", data);
};
export const updateFamilyCard = (id: string, data: FamilyCardModel) => {
  return API.put(`/family-card/${id}`, data);
};

// Resident
export const getResident = ({
  pageSize,
  current,
  filters = {},
}: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page_size", String(pageSize));
  params.set("page", String(current));

  Object.entries(filters).forEach(([Key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(Key, value);
    }
  });

  return API.get(`/resident?${params.toString()}`);
};
export const createResident = (data: FormData) => {
  return API.post("/resident", data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteResident = (id: string) => {
  return API.delete(`/resident/${id}`);
};
export const updateResident = (id: string, data: FormData) => {
  return API.patch(`/resident/${id}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

// Employee
export const getEmployee = ({
  current,
  pageSize,
  filters = {},
}: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page_size", String(pageSize));
  params.set("page", String(current));

  Object.entries(filters).map(([Key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(Key, value);
    }
  });

  return API.get(`/employee?${params.toString()}`);
};
export const createEmployee = (data: FormData) => {
  return API.post("/employee", data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateEmployee = (id: string, data: FormData) => {
  return API.patch(`/employee/${id}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteEmployee = (id: string) => {
  return API.delete(`/employee/${id}`);
};

// Incoming Letter
export const getIncomingLetter = ({
  current,
  pageSize,
  filters = {},
}: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page", String(current));
  params.set("page_size", String(pageSize));

  Object.entries(filters).map(([Key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(Key, value);
    }
  });
  return API.get(`/incoming-letter?${params.toString()}`);
};
export const createIncomingLetter = (data: FormData) => {
  return API.post("/incoming-letter", data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateIncomingLetter = (id: string, data: FormData) => {
  return API.patch(`/incoming-letter/${id}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteIncomingLetter = (id: string) => {
  return API.delete(`/incoming-letter/${id}`);
};

// Outgoing Letter
export const getOutgoingLetter = ({
  current,
  pageSize,
  filters = {},
}: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page", String(current));
  params.set("page_size", String(pageSize));

  Object.entries(filters).map(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, value);
    }
  });

  return API.get(`/outgoing-letter?${params.toString()}`);
};
export const createOutgoingLetter = (data: FormData) => {
  return API.post("/outgoing-letter", data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateOutgoingLetter = (id: string, data: FormData) => {
  return API.patch(`/outgoing-letter/${id}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteOutgoingLetter = (id: string) => {
  return API.delete(`/outgoing-letter/${id}`);
};

// Period
export const getPeriod = ({ current, pageSize, filters = {} }: QueryParams) => {
  const params = new URLSearchParams();
  params.set("page", String(current));
  params.set("page_size", String(pageSize));

  Object.entries(filters).map(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, value);
    }
  });

  return API.get(`/period?${params.toString()}`);
};
export const createPeriod = (data: FormData) => {
  return API.post("/period", data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updatePeriod = (id: string, data: FormData) => {
  return API.patch(`/period/${id}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deletePeriod = (id: string) => {
  return API.delete(`/period/${id}`);
};
