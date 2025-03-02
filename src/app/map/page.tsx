import Map from '@/components/Map';

const MAX_ROW_DATA_PER_CALL = 1000;

const fetchToilets = async () => {
  try {
    const totalCountRes = await fetch(
      `https://saveme-git-feat-data-fetching-caching-kimdonggu42s-projects.vercel.app/api/seoul-toilets/1/1`,
    );
    const parsedTotalCountRes = await totalCountRes.json();
    console.log(parsedTotalCountRes);
    const { list_total_count: totalCount } = parsedTotalCountRes.SearchPublicToiletPOIService;

    const promises = [];

    for (let startRowNum = 1; startRowNum <= totalCount; startRowNum += MAX_ROW_DATA_PER_CALL) {
      const endRowNum = Math.min(startRowNum + MAX_ROW_DATA_PER_CALL - 1, totalCount);
      const res = await fetch(
        `https://saveme-git-feat-data-fetching-caching-kimdonggu42s-projects.vercel.app/api/seoul-toilets/${startRowNum}/${endRowNum}`,
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
