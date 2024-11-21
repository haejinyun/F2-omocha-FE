import { GetBasicAuctionListParams } from '@/apis/types/basicAuction';
import BasicAuction from '@/app/basicauction/basicauction';
import AuctionDropDown from '@/app/basicauction/components/auctiondropdown';
import LeftSection from '@/app/basicauction/components/leftsection';
import MaxLayout from '@/components/MaxLayout';

import * as S from './Basicauction.css';
import Checkbox from './components/checkbox';

function Home({ searchParams }: { searchParams: GetBasicAuctionListParams }) {
  return (
    <MaxLayout>
      <div className={S.basicAuctionContainer}>
        <LeftSection />
        <section className={S.rightSection}>
          <div className={S.topInfoSection}>
            <Checkbox />
            <AuctionDropDown />
          </div>
          <BasicAuction searchParams={searchParams} />
        </section>
      </div>
    </MaxLayout>
  );
}

export default Home;
