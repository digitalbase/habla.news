import { useMemo } from "react";
import Link from "next/link";
import { Image } from "@chakra-ui/react";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import { Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { shortenString } from "@habla/format";
import { useUser } from "@habla/nostr/hooks";

export default function Username({ pubkey, renderLink, ...rest }) {
  const [relays] = useAtom(relaysAtom);
  const user = useUser(pubkey);
  const emoji =
    user?.emoji?.reduce((acc, t) => {
      return { ...acc, [t.at(1)]: t.at(2) };
    }, {}) ?? {};
  const emojified = useMemo(() => {
    if (!user?.name) {
      return;
    }
    let result = user.name;
    //todo: support multiple emoji
    for (const e of Object.keys(emoji)) {
      const img = emoji[e];
      const splitted = result.split(`:${e}:`);
      if (splitted.length > 1) {
        result = splitted.reduce((acc, val) =>
          [].concat(
            acc,
            <Image
              borderRadius="none"
              display="inline"
              boxSize={5}
              fit="contain"
              src={img}
            />,
            val
          )
        );
        break;
      }
    }
    return result;
  }, [user?.name, emoji]);
  const username = (
    <Text fontFamily="Inter" {...rest}>
      {emojified || shortenString(pubkey, 8)}
    </Text>
  );
  return renderLink ? (
    <Link href={`/p/${nip19.nprofileEncode({ pubkey, relays })}`}>
      {username}
    </Link>
  ) : (
    username
  );
}
