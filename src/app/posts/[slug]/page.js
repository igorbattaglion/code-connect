import logger from "@/logger";
import { remark } from "remark";
import html from "remark-html";
import styles from "./details.module.css";
import { CardPost } from "@/components/CardPost";

async function getPostBySlug(slug) {
  const url = `http://localhost:3042/posts?slug=${slug}`;
  const response = await fetch(url);

  if (!response.ok) {
    logger.error("Ops, alguma coisa correu mal");
    return {};
  }
  logger.info("Posts obtidos com sucesso");
  const data = await response.json();
  if (data.length == 0) {
    return {};
  }

  const post = data[0];

  const proccessedContent = await remark().use(html).process(post.markdown);
  const contentHtml = proccessedContent.toString();
  post.markdown = contentHtml;

  return post;
}
const PagePost = async ({ params }) => {
  const post = await getPostBySlug(params.slug);

  return (
    <>
      <CardPost post={post} highlight />
      <h2 className={styles.code}>Código:</h2>
      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: post.markdown }}
      ></div>
    </>
  );
};

export default PagePost;
