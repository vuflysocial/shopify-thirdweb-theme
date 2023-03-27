import {
  Button,
  ChakraProvider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ConnectWallet,
  ThirdwebProvider,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import CustomToast from "./components/Toast";
import { isValidAddress, isValidChainName } from "./constants";

const elements = document.querySelectorAll(".thirdwebtokengate");
const root = document.querySelector("#MainContent");

const TokenGate = ({ contractAddress, chainName }) => {
  const { onClose } = useDisclosure();
  const { contract } = useContract(contractAddress);
  const address = useAddress();
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(false);
  const isValidContractAddress = isValidAddress(contractAddress);
  const _isValidChainName = isValidChainName(chainName);
  const toast = useToast();

  useEffect(() => {
    if (address && contract && address) {
      setLoading(true);
      contract
        .getOwned(address)
        .then((owned) => {
          if (owned.length) {
            setOwned(owned);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [address, contract]);

  // Prevent all events on the page if modal is open. This is to prevent users from interacting with the page while the modal is open, even if they delete the modal from the DOM.
  useEffect(() => {
    const checkoutBtn = document.querySelector(".shopify-payment-button");
    const handleDisableEvents = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    if (!owned && checkoutBtn) {
      checkoutBtn.style.display = "none";
    } else if (checkoutBtn && owned) {
      checkoutBtn.style.display = "block";
    }
    if (!owned && root) {
      // Add listener to disable all events on the page
      root.addEventListener("click", handleDisableEvents);
      root.addEventListener("touchstart", handleDisableEvents);
      root.addEventListener("touchmove", handleDisableEvents);
      root.addEventListener("touchend", handleDisableEvents);
      root.addEventListener("touchcancel", handleDisableEvents);
      root.addEventListener("wheel", handleDisableEvents);
      root.addEventListener("mousewheel", handleDisableEvents);
      root.addEventListener("mousedown", handleDisableEvents);
      root.addEventListener("keydown", handleDisableEvents);
      root.addEventListener("keyup", handleDisableEvents);
      root.addEventListener("keypress", handleDisableEvents);
      root.addEventListener("submit", handleDisableEvents);
      root.addEventListener("mouseover", handleDisableEvents);
      // root.addEventListener("scroll", handleDisableEvents);
    } else if (root && owned) {
      // Remove listener to disable all events on the page
      root.removeEventListener("click", handleDisableEvents);
      root.removeEventListener("touchstart", handleDisableEvents);
      root.removeEventListener("touchmove", handleDisableEvents);
      root.removeEventListener("touchend", handleDisableEvents);
      root.removeEventListener("touchcancel", handleDisableEvents);
      root.removeEventListener("wheel", handleDisableEvents);
      root.removeEventListener("mousewheel", handleDisableEvents);
      root.removeEventListener("mousedown", handleDisableEvents);
      root.removeEventListener("keydown", handleDisableEvents);
      root.removeEventListener("keyup", handleDisableEvents);
      root.removeEventListener("keypress", handleDisableEvents);
      root.removeEventListener("submit", handleDisableEvents);
      root.removeEventListener("mouseover", handleDisableEvents);
      // root.removeEventListener("scroll", handleDisableEvents);

      checkoutBtn.style.display = "block";
    }

    return () => {
      if (root) {
        // Remove listener to disable all events on the page
        root.removeEventListener("click", handleDisableEvents);
        root.removeEventListener("touchstart", handleDisableEvents);
        root.removeEventListener("touchmove", handleDisableEvents);
        root.removeEventListener("touchend", handleDisableEvents);
        root.removeEventListener("touchcancel", handleDisableEvents);
        root.removeEventListener("wheel", handleDisableEvents);
        root.removeEventListener("mousewheel", handleDisableEvents);
        root.removeEventListener("mousedown", handleDisableEvents);
        root.removeEventListener("keydown", handleDisableEvents);
        root.removeEventListener("keyup", handleDisableEvents);
        root.removeEventListener("keypress", handleDisableEvents);
        root.removeEventListener("submit", handleDisableEvents);
        root.removeEventListener("mouseover", handleDisableEvents);
        // root.removeEventListener("scroll", handleDisableEvents);
      }
      if (checkoutBtn) {
        checkoutBtn.style.display = "block";
      }
    };
  }, [root, owned]);

  // Validate chain name and contract address
  useEffect(() => {
    if (!isValidContractAddress) {
      toast({
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top",
        render: () => (
          <CustomToast
            title="Invalid contract address"
            description="Please check the contract address in the token gate section"
          />
        ),
      });
    }
    if (!_isValidChainName) {
      toast({
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top",
        render: () => (
          <CustomToast
            title="Invalid chain name"
            description="Please check the chain name in the token gate section"
          />
        ),
      });
    }
  }, [isValidContractAddress]);

  if (!isValidContractAddress || !_isValidChainName) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <Modal isOpen={!owned} onClose={onClose} isCentered size="3xl">
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
          display="block !important"
        />
        <ModalContent
          bg="#131313"
          minW="xl"
          rounded="3xl"
          outline="0.5px solid rgba(255, 255, 255, 0.7)"
          zIndex={0}
        >
          <ModalBody
            minH="250px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Flex
              p={8}
              h="full"
              minW="xl"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              mx="auto"
              my="auto"
            >
              {loading ? (
                <Spinner />
              ) : !address ? (
                <Flex
                  my={4}
                  gap={8}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                >
                  <Text>STOP! We need to check if you're a member.</Text>
                  <ConnectWallet />
                </Flex>
              ) : (
                !owned && (
                  <Flex
                    my={4}
                    gap={8}
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                  >
                    <Text>
                      To access this product, you'll need the thirdweb DRIP
                      Builders Pass NFT.
                    </Text>
                    <ConnectWallet />
                    <Button
                      variant="solid"
                      w="200px"
                      h="50px"
                      bg="white"
                      color="black"
                      fontSize="2xl"
                      rounded="2xl"
                      onClick={() => {
                        window.location.href =
                          "https://meloinu.herokuapp.com/roadmap";
                      }}
                    >
                      Go Claim NFT
                    </Button>
                  </Flex>
                )
              )}
              <Flex
                mt={4}
                direction="column"
                gap={2}
                justifyContent="center"
                alignItems="center"
              >
                <small>Melo Inu?</small>
                <small>
                  Become a member{" "}
                  <a
                    href="https://meloinu.herokuapp.com/roadmap"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    here
                  </a>
                </small>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const Wrapper = ({ contractAddress, chainName }) => {
  return (
    <ChakraProvider
      colorModeManager={{
        type: "localStorage",
        get: () => "dark",
        set: () => {},
      }}
    >
      <ThirdwebProvider activeChain={chainName}>
        <TokenGate contractAddress={contractAddress} chainName={chainName} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
};

elements &&
  [...elements].forEach((node) => {
    const root = createRoot(node);
    root.render(
      <Wrapper
        contractAddress={node.getAttribute("data-contract-address")}
        chainName={node.getAttribute("data-chain-name")}
      />
    );
  });
