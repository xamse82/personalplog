import Head from "next/head";
import "slick-carousel/slick/slick.css";
import Banner from "../components/Banner";
import BannerBottom from "../components/BannerBottom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {SanityClient,urlFor } from '../sanity'
import { Posts } from "../typings";
import Image from "next/image";
import Link from "next/link";
interface Props {
  post : [Posts]
}

export default function Home({post} : Props) {

  
  return (
    <div>
      <Head>
        <title>My Blog | Explore the new horizon</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <main className="font-bodyFont">
        {/* ============ Header Start here ============ */}
        <Header />
        {/* ============ Header End here ============== */}
        {/* ============ Banner Start here ============ */}
        <Banner />
        {/* ============ Banner End here ============== */}
        <div className="max-w-7xl mx-auto h-60 relative">
          <BannerBottom />
        </div>
        {/* ============ Banner-Bottom End here ======= */}
        {/* ============ Post Part Start here ========= */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6">
          {

          
            post.map((posts) => (
              <Link key={posts._id} href={`/post/${posts.slug.current}`}>
                <div>
              <div>
                <Image width={400} height={200} src={urlFor(posts.mainImage).url()!} alt={""}/>
              </div>
              <div>
              <p>{posts.title}</p>        
              <Image className="w-12 h-12 rounded-full object-cover"
                    src={urlFor(posts.author.image).url()!} alt={""}
                    width={20} height={20}/>        
              </div>
              <p className="py-2 px-4 text-base">
                {posts.description}...by {""}
                <span className="">{posts.author.name}</span>

              </p>
              </div>
              </Link>
            ))
            
          }
        </div>
        {/* ============ Post Part End here =========== */}
        {/* ============ Footer Start here============= */}
        <Footer />
        {/* ============ Footer End here ============== */}
      </main>
    </div>
  );
}



export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
      title,
      author -> {
        name,
        image 
      },
      description,
      mainImage,
      slug
  }`

  const post = await SanityClient.fetch(query);
  return {
    props: {
         post
    },
  };
}