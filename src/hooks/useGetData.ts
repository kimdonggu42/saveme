'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { ToiletData } from '@/util/type';
import { AxiosResponse } from 'axios';

const MAX_ROWS = 1000;

export const useGetData = () => {
  const [toiletData, setToiletData] = useState<ToiletData[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const getTotalCount = async () => {
    try {
      const res = await axios.get('/api/seoul-toilets/1/1');
      return res.data.SearchPublicToiletPOIService.list_total_count;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };

  useEffect(() => {
    const getData = async () => {
      setDataLoading(true);
      try {
        const totalCount = await getTotalCount();
        const promises: Promise<AxiosResponse>[] = [];

        for (let start = 1; start <= totalCount; start += MAX_ROWS) {
          const end = Math.min(start + MAX_ROWS - 1, totalCount);
          promises.push(axios.get(`/api/seoul-toilets/${start}/${end}`));
        }

        const res = await Promise.all(promises);

        const allRowData = res.reduce((acc, cur) => {
          const rowData = cur.data.SearchPublicToiletPOIService.row;
          return acc.concat(rowData);
        }, []);

        setToiletData(allRowData);
        setDataLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  return { toiletData, dataLoading };
};
