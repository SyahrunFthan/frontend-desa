import {
  AlertCircle,
  CheckCircle,
  Heart,
  MapPin,
  RotateCcw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import AppLayout from "../../../layouts/appLayout";
import { COLORS } from "../../../assets";
import { useEffect, useState } from "react";
import { Button, Input, message, notification } from "antd";
import {
  processFail,
  processFailN,
  processFinish,
  processStart,
  processSuccess,
} from "../../../helpers/process";
import { getSocialAssistanceByResidentId } from "../../../apis";
import type { AxiosError } from "axios";
import type { SocialAssistance } from "../../../models/socialAssistance";
import dayjs from "dayjs";
import { status } from "../../../models/global";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SocialAssistancePage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SocialAssistance[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderN] = notification.useNotification();
  const navigate = useNavigate();

  const formatNik = (nik: string) => {
    return nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
  };

  const isNikValid = (nik: string) => {
    return nik.length === 16 && /^\d+$/.test(nik);
  };

  const fetchData = async (
    residentId: string,
    opts: { pushToUrl?: boolean }
  ) => {
    const { pushToUrl = true } = opts;

    if (!residentId?.trim()) {
      processFail(messageApi, "handleSearch", "Resident ID tidak boleh kosong");
      return;
    }
    try {
      setProcessing(true);
      processStart(messageApi, "handleSearch", "Searching Social Assistance");
      const response = await getSocialAssistanceByResidentId(search);
      if (response.status === 200) {
        const { data } = response.data;

        processSuccess(messageApi, "handleSearch", "Data Ditemukan", () => {
          setProcessing(false);
          setResults(data);
          if (pushToUrl) {
            const query = new URLSearchParams();
            query.set("resident_id", residentId);
            navigate({ search: query.toString() });
          }
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 404) {
        processFailN(
          notificationApi,
          "handleSearch",
          axiosError.response?.data?.message || "Not Found"
        );
        setSearch("");
        setResults(null);
      } else {
        processFail(
          messageApi,
          "handleSearch",
          axiosError.response?.data?.message || "Server Error"
        );
        setSearch("");
        setResults(null);
      }
    } finally {
      processFinish(messageApi, () => {
        setProcessing(false);
      });
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const resident_id = query.get("resident_id");
    if (resident_id && resident_id !== search) {
      setSearch(resident_id);
      fetchData(resident_id, { pushToUrl: false });
    }
  }, [location.search]);

  return (
    <AppLayout>
      {contextHolder}
      {contextHolderN}

      <section id="information" className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: COLORS.secondary }}
            >
              Cek Status Bansos
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: COLORS.darkGray }}
            >
              Periksa status penerima bantuan sosial dengan mudah dan cepat
              menggunakan NIK
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="p-8">
                <div
                  className="w-16 h-16 mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.success}20` }}
                >
                  <Search
                    className="w-8 h-8"
                    style={{ color: COLORS.success }}
                  />
                </div>

                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: COLORS.secondary }}
                >
                  Pencarian Data Bansos
                </h3>

                <p className="mb-6" style={{ color: COLORS.darkGray }}>
                  Masukkan NIK (Nomor Induk Kependudukan) untuk memeriksa status
                  penerima bantuan sosial
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Masukkan NIK (16 digit)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                      style={{
                        borderColor:
                          isNikValid(search) || search === ""
                            ? COLORS.gray
                            : COLORS.red || "#ef4444",
                      }}
                      maxLength={16}
                    />
                    <User
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: COLORS.placeHolder }}
                    />
                    {search && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {isNikValid(search) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {search && !isNikValid(search) && (
                    <div className="flex items-center p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-red-600">
                        NIK harus memiliki 16 digit angka
                      </p>
                    </div>
                  )}

                  {results !== null && (
                    <div
                      className="p-6 rounded-lg border-2 space-y-4"
                      style={{
                        borderColor: COLORS.success,
                        backgroundColor: `${COLORS.success}05`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle
                            className="w-6 h-6 mr-2"
                            style={{ color: COLORS.success }}
                          />
                          <span
                            className="font-semibold text-lg"
                            style={{ color: COLORS.success }}
                          >
                            Data Ditemukan
                          </span>
                        </div>
                      </div>

                      <div
                        className="bg-white p-4 rounded-lg border"
                        style={{ borderColor: COLORS.gray }}
                      >
                        <h4
                          className="font-bold text-lg mb-3"
                          style={{ color: COLORS.secondary }}
                        >
                          <User className="w-5 h-5 inline mr-2" />
                          Informasi Penerima
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: COLORS.darkGray }}
                            >
                              Nama:
                            </span>
                            <p
                              className="font-semibold mt-1"
                              style={{ color: COLORS.secondary }}
                            >
                              {results[0].resident?.fullname}
                            </p>
                          </div>
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: COLORS.darkGray }}
                            >
                              NIK:
                            </span>
                            <p
                              className="font-semibold mt-1 font-mono"
                              style={{ color: COLORS.secondary }}
                            >
                              {formatNik(search)}
                            </p>
                          </div>
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: COLORS.darkGray }}
                            >
                              Tempat Lahir:
                            </span>
                            <p
                              className="font-semibold mt-1 font-mono"
                              style={{ color: COLORS.secondary }}
                            >
                              {results[0].resident?.place_of_birth}
                            </p>
                          </div>
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: COLORS.darkGray }}
                            >
                              Tanggal Lahir:
                            </span>
                            <p
                              className="font-semibold mt-1 font-mono"
                              style={{ color: COLORS.secondary }}
                            >
                              {dayjs(
                                results[0].resident?.date_of_birth,
                                "YYYY-MM-DD"
                              ).format("DD/MM/YYYY")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span
                            className="font-medium flex items-center"
                            style={{ color: COLORS.darkGray }}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Alamat:
                          </span>
                          <p
                            className="mt-1"
                            style={{ color: COLORS.secondary }}
                          >
                            {results[0].resident?.address}
                          </p>
                        </div>
                      </div>

                      <div
                        className="bg-white p-4 rounded-lg border"
                        style={{ borderColor: COLORS.gray }}
                      >
                        <h4
                          className="font-bold text-lg mb-3"
                          style={{ color: COLORS.secondary }}
                        >
                          <Heart className="w-5 h-5 inline mr-2" />
                          Bantuan Sosial yang Diterima
                        </h4>

                        <div className="space-y-3">
                          {results.map((item, index: number) => {
                            const itemStatus = status.find(
                              (i) => i.value === item.status_assistance
                            );
                            return (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 rounded-lg border-l-4"
                                style={{
                                  borderLeftColor:
                                    item.status_assistance === "active"
                                      ? COLORS.success
                                      : COLORS.red,
                                  backgroundColor: `${
                                    item.status_assistance === "active"
                                      ? COLORS.success
                                      : COLORS.red
                                  }05`,
                                }}
                              >
                                <div className="flex-1">
                                  <span
                                    className="font-medium"
                                    style={{ color: COLORS.secondary }}
                                  >
                                    {item.assistance?.name}
                                  </span>
                                  <div
                                    className="flex items-center mt-1 text-xs"
                                    style={{ color: COLORS.darkGray }}
                                  >
                                    {item.status_assistance === "active" ? (
                                      <CheckCircle
                                        className="w-3 h-3 mr-1"
                                        style={{ color: COLORS.success }}
                                      />
                                    ) : (
                                      <CloseCircleOutlined
                                        className="w-3 h-3 mr-1"
                                        style={{ color: COLORS.red }}
                                      />
                                    )}
                                    Status: {itemStatus?.label}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center">
                                    {item.assistance?.type_assistance ===
                                    "cash" ? (
                                      <div className="flex flex-col">
                                        <span
                                          className="font-bold text-lg"
                                          style={{ color: COLORS.success }}
                                        >
                                          Rp{" "}
                                          {item.assistance?.amount.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 font-semibold">
                                          {item.month_of_aid}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col">
                                        <span
                                          className="font-bold text-lg"
                                          style={{ color: COLORS.success }}
                                        >
                                          Sembako
                                        </span>
                                        <span className="text-gray-500 font-semibold">
                                          {item.month_of_aid}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div
                          className="mt-4 p-3 rounded-lg border-2"
                          style={{
                            borderColor: COLORS.success,
                            backgroundColor: `${COLORS.success}10`,
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className="font-semibold"
                              style={{ color: COLORS.secondary }}
                            >
                              Total Bantuan Tunai:
                            </span>
                            <span
                              className="font-bold text-xl"
                              style={{ color: COLORS.success }}
                            >
                              Rp.{" "}
                              {results
                                ?.reduce((total, item) => {
                                  if (item.status_assistance === "active") {
                                    return (
                                      total + (item.assistance?.amount || 0)
                                    );
                                  }
                                  return total;
                                }, 0)
                                .toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSearch("");
                          setResults(null);
                          navigate({ search: "" });
                        }}
                        className="w-full py-2 rounded-full border-2 font-semibold hover:shadow-md transition-all duration-200 flex items-center justify-center mb-4"
                        style={{
                          borderColor: COLORS.gray,
                          color: COLORS.darkGray,
                          backgroundColor: "transparent",
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Pencarian
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  size="large"
                  className="w-full mt-6 py-3 rounded-full border-none h-14 !text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{
                    backgroundColor: isNikValid(search)
                      ? COLORS.success
                      : COLORS.gray,
                  }}
                  icon={<Search className="w-4 h-4 mr-2" />}
                  disabled={processing || !isNikValid(search)}
                  onClick={async () =>
                    await fetchData(search, { pushToUrl: true })
                  }
                >
                  Cek Bansos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default SocialAssistancePage;
