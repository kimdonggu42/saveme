import Map from '@/components/Map';

const MAX_ROW_DATA_PER_CALL = 1000;
const revalidate = 3600;

const fetchToilets = async () => {
  try {
    const totalCountRes = await fetch(
      `http://openAPI.seoul.go.kr:8088/${process.env.SEOUL_OPEN_API_KEY}/json/SearchPublicToiletPOIService/1/1`,
      { next: { revalidate } },
    );
    const parsedTotalCountRes = await totalCountRes.json();
    const { list_total_count: totalCount } = parsedTotalCountRes.SearchPublicToiletPOIService;

    const promises = [];

    for (let startRowNum = 1; startRowNum <= totalCount; startRowNum += MAX_ROW_DATA_PER_CALL) {
      const endRowNum = Math.min(startRowNum + MAX_ROW_DATA_PER_CALL - 1, totalCount);
      const res = await fetch(
        `http://openAPI.seoul.go.kr:8088/${process.env.SEOUL_OPEN_API_KEY}/json/SearchPublicToiletPOIService/${startRowNum}/${endRowNum}`,
        { next: { revalidate } },
      );
      const parsedRes = await res.json();
      promises.push(parsedRes);
    }

    const resArray = await Promise.all(promises);
    const allRowData = resArray.reduce((acc, cur) => {
      const { row } = cur.SearchPublicToiletPOIService;
      return acc.concat(row);
    }, []);

    return allRowData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function MapPage() {
  const toilets = await fetchToilets();

  return <Map toilets={toilets} />;
}
