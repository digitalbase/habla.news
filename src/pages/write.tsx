import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Text } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { pubkeyAtom, sessionAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
import { useAtomValue } from "jotai/index";
const Write = dynamic(() => import("@habla/components/Write"), {
  ssr: false,
});

export default function WritePage() {
  const { t } = useTranslation("common");
  const url = "https://habla.news/write";
  const metadata = {
    title: t("habla"),
    summary: t("tagline"),
  };

  const session = useAtomValue(sessionAtom);
  const [pubkey] = useAtom(pubkeyAtom);

  if (session && session.method === 'pubkey') {
    return (
      <>
        <Metadata url={url} metadata={metadata} />
        <Layout>
          <Text>Account is in read-only mode. Make sure Habla has access to your private key.</Text>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Metadata url={url} metadata={metadata} />
      <Layout>
        {!pubkey && <Text>Log in to write</Text>}
        {pubkey && <Write pubkey={pubkey} />}
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
