'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';

interface Toilet {
  POI_ID: string;
  ANAME: string;
  CENTER_X1: number;
  CENTER_Y1: number;
  CNAME: string;
  FNAME: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  X_WGS84: number;
  Y_WGS84: number;
  DISTANCE: number;
}

const MAX_ROW_DATA_PER_CALL = 1000;

export const useGetToilets = () => {
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [isToiletsLoading, setIsToiletsLoading] = useState<boolean>(false);

  const getTotalCount = async () => {
    try {
      const res = await axios.get('/api/seoul-toilets/1/1');
      const { list_total_count } = res.data.SearchPublicToiletPOIService;
      return list_total_count;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };

  useEffect(() => {
    const getToilets = async () => {
      setIsToiletsLoading(true);
      try {
        const totalCount = await getTotalCount();
        const promises: Promise<AxiosResponse>[] = [];

        for (let startRowNum = 1; startRowNum <= totalCount; startRowNum += MAX_ROW_DATA_PER_CALL) {
          const endRowNum = Math.min(startRowNum + MAX_ROW_DATA_PER_CALL - 1, totalCount);
          promises.push(axios.get(`/api/seoul-toilets/${startRowNum}/${endRowNum}`));
        }

        const res = await Promise.all(promises);
        const allRowData = res.reduce((acc, cur) => {
          const { row } = cur.data.SearchPublicToiletPOIService;
          return acc.concat(row);
        }, []);

        setToilets(allRowData);
        setIsToiletsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    getToilets();
  }, []);

  return { toilets, isToiletsLoading };
};
