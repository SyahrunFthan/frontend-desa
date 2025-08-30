import { Calendar, User, Image } from "lucide-react";
import { Card } from "antd";
import type { NewsModel } from "../../models/news";
import type { StatisticNews } from "../../models/statisticNews";
import dayjs from "dayjs";

interface Props {
  news: NewsModel | null;
  statistic: StatisticNews | null;
  totalComment: number;
}

const NewsDetailContent = (params: Props) => {
  const { news, statistic, totalComment } = params;
  const totalView = statistic?.total_view ?? 0;
  const totalShare = statistic?.total_share ?? 0;

  const totalEngagement = totalShare + totalComment;

  const engagementRate =
    totalView > 0 ? ((totalEngagement / totalView) * 100).toFixed(2) : 0;

  return (
    <Card className="max-h-screen">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-80 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {news?.image !== "activity.png" ? (
                  <img
                    src={news?.path_image}
                    alt={news?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <Image size={48} className="mx-auto mb-2 opacity-70" />
                    <p className="text-sm opacity-70">No image uploaded</p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {news?.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Oleh {news?.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {" "}
                      {dayjs(news?.date_of_issue, "YYYY-MM-DD").format(
                        "dddd, DD MMMM YYYY"
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Ringkasan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {news?.summary}
                  </p>
                </div>

                <div className="prose max-w-none">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Konten Berita
                  </h3>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: news?.content ?? "" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                Informasi Publikasi
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <p className="text-gray-900">{news?.author}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Terbit
                  </label>
                  <p className="text-gray-900">
                    {dayjs(news?.date_of_issue, "YYYY-MM-DD").format(
                      "dddd, DD MMMM YYYY"
                    )}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Statistik</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold text-gray-900">
                    {statistic?.total_view}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shares</span>
                  <span className="font-semibold text-gray-900">
                    {statistic?.total_share}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comments</span>
                  <span className="font-semibold text-gray-900">
                    {totalComment}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Engagement Rate
                    </span>
                    <span className="font-semibold text-green-600">
                      {engagementRate} %
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsDetailContent;
