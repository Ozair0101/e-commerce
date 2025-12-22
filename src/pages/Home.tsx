import React, { useEffect, useMemo, useState } from 'react';

import HeroSection from '../components/HeroSection';
import Carousel from '../components/Carousel';
import TopSellers from '../components/TopSellers';

import Categories from '../components/Categories';
import PromoBanner from '../components/PromoBanner';
import TrendingRow from '../components/TrendingRow';
import Feature from '../components/Feature';
import type { Product } from '../components/ProductCard';
import type { Category } from '../components/Categories';
import type { TrendItem } from '../components/TrendingRow';
import api from '../utils/api';

const Home: React.FC = () => {
  const [topSellerProducts, setTopSellerProducts] = useState<Product[]>([]);
  const [topSellersLoading, setTopSellersLoading] = useState<boolean>(true);

  interface ApiProductImage {
    id: number;
    url: string;
    is_primary: boolean;
  }

  interface ApiProduct {
    product_id: number;
    name: string;
    price: number;
    discount_price: number | null;
    average_rating?: number | null;
    images?: ApiProductImage[];
  }

  const backendOrigin = useMemo(() => {
    try {
      const base = (api.defaults.baseURL as string) || '';
      return base ? new URL(base).origin : window.location.origin;
    } catch {
      return window.location.origin;
    }
  }, []);

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        const backend = new URL(backendOrigin);

        const isLocalhost = parsed.hostname === 'localhost';
        const hasNoPort = !parsed.port;
        const backendHasPort = !!backend.port;

        if (isLocalhost && hasNoPort && backendHasPort) {
          return `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }

        return url;
      } catch {
        return url;
      }
    }

    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTopSellers = async () => {
      try {
        setTopSellersLoading(true);
        const response = await api.get('/latest-products');
        const data: ApiProduct[] = response.data.data || response.data;

        if (!isMounted) return;

        const mapped: Product[] = data.slice(0, 12).map((p) => {
          const primaryImage =
            p.images && p.images.length > 0
              ? p.images.find((img) => img.is_primary) || p.images[0]
              : undefined;

          const finalPrice =
            p.discount_price !== null && p.discount_price < p.price
              ? p.discount_price
              : p.price;

          const hasRealRating = typeof p.average_rating === 'number' && !Number.isNaN(Number(p.average_rating));
          const rating = hasRealRating ? Number(p.average_rating) : 4.5;

          return {
            id: String(p.product_id),
            title: p.name,
            price: `$${Number(finalPrice).toFixed(2)}`,
            rating,
            image: resolveImageUrl(primaryImage?.url),
          };
        });

        setTopSellerProducts(mapped);
      } catch (err) {
        console.error('Error fetching latest products for Top Sellers:', err);
      } finally {
        if (isMounted) {
          setTopSellersLoading(false);
        }
      }
    };

    fetchTopSellers();

    return () => {
      isMounted = false;
    };
  }, [backendOrigin]);

  // const categories: Category[] = [
  //   {
  //     id: 'c1',
  //     name: 'Electronics',
  //     image:
  //       'https://lh3.googleusercontent.com/aida-public/AB6AXuBbI4LlRLHqKg0JQL803dE6HXZjs0Qwl-adV7Ikag6epfRmRS9wcyO_eQsDQSZv5bIbbuxhuGd7ZtSREUE8xY0atYsU1AiGq6CBbVHuTx-RvmYhHL0v7I5Q2fTw1qaV1vnfPkgitFitpsYMy7yQCw2wz3S7MP3bpoiTBYQ-50PfHVT2C85hVw5LrMCEdrZpp9N4BQERA6Nk3yKPz-VeUyzrpAwCh-8GpZoDLzbUKvFAPPzmfw8Hh6WTzcdmHx7fatIfLQ4LFQh2hFA',
  //   },
  //   {
  //     id: 'c2',
  //     name: 'Home & Kitchen',
  //     image:
  //       'https://lh3.googleusercontent.com/aida-public/AB6AXuBEBToWYF5PhRf7fJbxG6MATAEjdEhIpjso6vJTrv6P1NAn9OEOBSjBkM9lbBAO1n0ehwG9vozAYOUYY32tyrjPsM8_lpuT37tCPc2xIcNOV0UDWkrCXGWuKbga8Pa8y-7dc9XXZdvLu6E0Xd_UX-JoDNlsPzuVqWETUUYUhDvmHf459PasWkk8xIlnfJq7ktpcPKDuxsFFQc-aJyH0ThrVyDhri9P9rhHoYAI0IeTmrbx1g3ovaCAJELXh3gpIXrBps2IQ3C5bDoo',
  //   },
  //   {
  //     id: 'c3',
  //     name: 'Fashion',
  //     image:
  //       'https://lh3.googleusercontent.com/aida-public/AB6AXuBWpX5r4VLm-LXUq9Qg2YyF7K6TA_e-cy30AkBgLMxMy282kKbZrUUap7-0d5WLYVhq8SrdpRnntO-B9jM1cBt_3fdNoN9kz7G2u_hULiLHnaDmTBG9lqi2qPSsvZFJwCyIQtjoSnXrj2iMeJglIQCg0Q6Z7cNvvvoLJLxchkSbn-EvqmRRXFdqKJdt95kFGpAFtP_ntzkhQNeTfBqUrNyaLtXzw6aiswShIRwiPzufIYFpc-nF-nP9HV2rpF7_YY940z8RkG-9e_c',
  //   },
  //   {
  //     id: 'c4',
  //     name: 'Books',
  //     image:
  //       'https://lh3.googleusercontent.com/aida-public/AB6AXuDcg3wKOyc6aIalRW8x-QWIdo0-zRIa0DuOp9FI2Q1-hgEmhMwGhUnk1OI9JgNDMGxKi5NbIRHcAICd1a4LoVOeQxuCrVDagNDVtMAigADTRW2v0grvuatriJlVgWStuwdEleTUjKJZIUBsW6JZPo1RY7U4PswY9Ot8Awt2YfTz1pcByyJEI2L4GFQsOoiaRGZijvPGYGINSC-jPVp7abSFkfLyVBTPyUZi9xuHHW2g6LA9G9-Qe8Y2Nu_fK-tubqBLjl_YHlqYkes',
  //   },
  // ];

  const trending: TrendItem[] = [
    {
      id: 't1',
      title: 'Professional DSLR Camera Kit',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrjJ8C-lPlm6zMsLuGhN-bv0PJNlVORUl3n5TwhfHFajys4KQka5DyIrwCgTPfMcxkPOmKKcelh_zmqR7bBfimpwHZqlnjOpqDkGw85Ahm4tUzPrTv4sEzP_rgKjGlEIoOOeKVHCTjwO21yS8CMJB0P6_b_HdEMK2IZMLljPnuZ2CCIUCodzU9xkuRkGD1Pynd-y_a73sleCspfnW_pe58ZfSsAV5yeCWpF49bWklAdD5gQhaLyjHyrGJS7olZz7OChXXcTgIUHU',
    },
    {
      id: 't2',
      title: 'Ergonomic Office Chair',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Q1ec-RTiKa56vftNrqtbBcO616e9Ty2_7oOIMy66JbRLvu1KtU5pNUUkmUYTiJbZYr11kCFXilyJ4z9hZT5DLOaeUp_dJp4CJS9qVN87NfpT9TVHi-D8WSoxue50JCNlDCtkojOoCVBtjx4w8Umuapf0bJCYiUJIzy_bZHjcPlG2ztamqDGhsV-Rx_uizT5RehkCxUfICHTtqYagsgKnKQyaAmSwQDmsl1Km3MgMNPVGJ9B2LX-mk1rMtWkVCwwc90mpu4Cb0Tc',
    },
    {
      id: 't3',
      title: 'Portable Bluetooth Speaker',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgLPvOhKcyca2uJkEJK33Z66sE-eNo0pccstNzRUVMqYazp0l2Ew_frQR6Iqlsf1BxTXn2tsjl7V9qzVz9IsvyLQKCpV_5nqQBE1v4jSMIgP140F5_5eu3N9QoSLP3PI8y_GS4NlK3CObC9oJEnRQ5h6XZ1WZyU9_oRWhCQLPjuiAq6OB6CP83icPXy1BWbubpz03cDJiZgSZAJxnOCPzYwyev7hddGI3BL80oKJxDhQfLmT0lvuNDy1OxzbN0DRMNM9-ZjqIjFg4',
    },
    {
      id: 't4',
      title: 'Robot Vacuum Cleaner',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDIdp1HeYoie0-0WaB5e_L-eLrXTm8wyv7-CCGjDLFbW74YduPVf-l1JkFLs-9En6e7AilDKE6kU0WPvzXI4ybmihXLTUPMEfIZTkRdzQC4w5yHRkWiaEniNGV5cySftMII_C-Q-D_vOW1mQq91JhtDS-2XygrwX191hP0fcArfEdrGCnpOy20-6Ojl5DEMPA-sQwP5XNAg3o0EJQkIwL0jK70X3eRgdb3EpQx4dldadzuMyoJToHe7sjSmoIeEDzAr_VM7ALKymtE',
    },
  ];

  const promoImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC0s4BvKN-irQp4V2kl0BnRhzJEk23E-h5M8chj1EUlbQgEnOs02XBYRIvSFrE91oi1Cqdg9cu958ySBxbUxSWJyUq2Cg2ty54V_Nofxk7-GL435ctSzb7lOEzAs8UdZt_hdyZIZV_iDX-lirQU0SobXjGfdeUq9WNHIRX9lxlSTDXZ_6Id95HEp9ve55defGOhYmCZOXso73sm82IRMKQ75fkPLuGq1wN-1y7QsYQJftOvaxGvaPdxJqu0cHDbJECiAXRc1QaA_Bg';

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-full max-w-7xl flex-col">
        {/* Hero Section */}
        <HeroSection />
        {/* <Carousel
          title="Featured Deals of the Week"
          subtitle="Don't miss out on these limited-time offers"
          image={carouselImage}
        /> */}
        <Feature />
        <TopSellers products={topSellerProducts} loading={topSellersLoading} />
        {/* <Categories categories={categories} /> */}
        <PromoBanner title="Limited-Time Offers" subtitle="Get ready for our seasonal sale event!" image={promoImage} />
        <TrendingRow items={trending} />
      </div>
    </div>
  );
};

export default Home;