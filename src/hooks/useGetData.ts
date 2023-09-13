import { useState, useEffect } from "react";
import { PROXY_API } from "../util/api";
import { ToiletData } from "../util/interface";

const MAX_ROWS = 1000;

export const useGetData = () => {
  const [toiletData, setToiletData] = useState<ToiletData[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const getData = async () => {
    try {
      let start = 1;
      let end = MAX_ROWS;
      const allRowData = [];

      while (true) {
        const res = await PROXY_API.get(`${start}/${end}`);
        const rowData = res.data.SearchPublicToiletPOIService.row;
        const totalCount = res.data.SearchPublicToiletPOIService.list_total_count;

        allRowData.push(...rowData);

        if (totalCount <= end) {
          break;
        }

        start = end + 1;
        end = Math.min(end + MAX_ROWS, totalCount);
      }
      setToiletData(allRowData);
      setDataLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return { toiletData, dataLoading };
};
