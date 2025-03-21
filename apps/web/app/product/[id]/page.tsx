"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button, Container, Typography, Box, Paper, Grid, Chip, Divider, Rating, TextField, ThemeProvider, Skeleton } from "@mui/material"
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Star } from "lucide-react"
import Image from "next/image"
import { getColor, getProduct } from "../../../src/data/loader"
import { createDynamicTheme } from "@repo/ui/theme"

// Product type definition
interface Image {
    url: string;
  }
  
  interface Product {
    id: number;
    title: string;
    description: string;
    images: Image[]; // Array of image objects
    price: number;
    rating: number;
    discount?: number;
    isNew?: boolean;
    isBestseller?: boolean;
    features?: string[];
    colors: string[];
  }
  

  const dummyProduct: Product = {
    id: 0,
    title: "Sample Product",
    description: "This is a placeholder product description. Replace with actual data when available.",
    images: [{ url: "/placeholder.svg?height=600&width=600" }], // Using an array of objects
    price: 99.99,
    rating: 4.5,
    discount: 10,
    isNew: true,
    features: ["Feature 1", "Feature 2", "Feature 3"],
    colors: ["Red", "Blue", "Green"],
  };
  

const ProductSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Skeleton variant="text" width={300} height={40} />
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={500} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )

export default function ProductDetail() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [color, setColor] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("")
  const [inWishlist, setInWishlist] = useState(false)
  const [selectedImage, setSelectedImage] = useState("");
  

  useEffect(() => {
    async function fetchProduct() {
      try {
        
        const colorData = await getColor("light");
            if (colorData?.theme?.palette?.primary?.main) {
                setColor(colorData);
            }

        const data = await getProduct(`${id}`)
        
        const mappedProduct: Product = {
            id: Number(id),
            title: data.name,
            description: data.description,
            images: Array.isArray(data.images) ? data.images : [], // Ensures it's an array
            price: 99.99, // Default price if missing
            rating: 4.5, // Default rating if missing
            colors: ["Red", "Blue", "Green"], // Default colors if missing
          };
          
  
        setProduct(mappedProduct)
        setSelectedColor(mappedProduct.colors[0] || "")
      } catch {
        setProduct(dummyProduct)
        setSelectedColor(dummyProduct.colors[0] || "")
      }
    }
    if (id) fetchProduct()
  }, [id])

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const toggleWishlist = () => {
    setInWishlist(!inWishlist)
  }

  const renderRatingStars = (rating: number) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Rating
          value={rating}
          precision={0.1}
          readOnly
          icon={<Star className="fill-yellow-400 text-yellow-400" />}
          emptyIcon={<Star className="text-gray-300" />}
        />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ({rating})
        </Typography>
      </Box>
    )
  }

  if (!product) return <ProductSkeleton />

  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : null
    
  const themes = createDynamicTheme(color);

  console.log("color",color);
  console.log("theme",themes);

  return (
    <Suspense fallback={<ProductSkeleton />}>
    <ThemeProvider theme={themes}>
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Button startIcon={<ArrowLeft />} onClick={() => router.push("/")} sx={{ mb: 4 }} variant="outlined">
        Back to products
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          bgcolor: "background.default",
          position: "relative",
        }}
      >
        {/* Product badges */}
        <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 2, display: "flex", gap: 1 }}>
          {product.isNew && (
            <Chip
              label="NEW"
              size="small"
              sx={{
                bgcolor: "#10b981",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            />
          )}
          {product.isBestseller && (
            <Chip
              label="BESTSELLER"
              size="small"
              sx={{
                bgcolor: "#f59e0b",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            />
          )}
          {product.discount && (
            <Chip
              label={`-${product.discount}%`}
              size="small"
              sx={{
                bgcolor: "#ef4444",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        <Grid container spacing={{ xs: 4, md: 8 }}>
        <Grid item xs={12} md={6}>
      {/* Big Image */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", sm: "400px", md: "500px" },
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Image
          src={selectedImage || product.images?.[0]?.url as string}
          alt={product.title}
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </Box>

      {/* Small Image Thumbnails */}
      <Box sx={{ display: "flex", gap: 2, mt: 2, overflowX: "auto", pb: 1 }}>
        {product.images.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              height: 80,
              width: 80,
              flexShrink: 0,
              borderRadius: 2,
              overflow: "hidden",
              border: "2px solid",
              borderColor: selectedImage === img.url ? "primary.main" : "transparent",
              cursor: "pointer",
              "&:hover": {
                borderColor: "primary.light",
              },
            }}
            onClick={() => setSelectedImage(img.url)}
          >
            <Image
              src={img.url || ""}
              alt={`${product.title} view ${index}`}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        ))}
      </Box>
    </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                {product.title}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {renderRatingStars(product.rating)}
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {Math.floor(Math.random() * 100) + 50} reviews
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                {discountedPrice ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
                      ${discountedPrice}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      ${product.price}
                    </Typography>
                    <Chip
                      label={`SAVE ${product.discount}%`}
                      size="small"
                      sx={{
                        bgcolor: "#ef4444",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                ) : (
                  <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
                    ${product.price}
                  </Typography>
                )}
              </Box>

              <Typography variant="body1" sx={{ mb: 4, color: "text.secondary", lineHeight: 1.8 }}>
                {product.description}
              </Typography>

              {product.features && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    Key Features:
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                    {product.features.map((feature, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Color:
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {product.colors.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      sx={{
                        px: 2,
                        py: 1,
                        border: "2px solid",
                        borderColor: selectedColor === color ? "primary.main" : "divider",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Typography variant="body2">{color}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ width: 80 }}
                  size="small"
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: "auto" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    flex: { xs: "1 1 100%", sm: "1 1 auto" },
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  variant={inWishlist ? "contained" : "outlined"}
                  color={inWishlist ? "secondary" : "primary"}
                  size="large"
                  startIcon={<Heart className={inWishlist ? "fill-current" : ""} />}
                  onClick={toggleWishlist}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  {inWishlist ? "In Wishlist" : "Wishlist"}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Share2 />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Share
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Truck size={20} />
                  <Typography variant="body2">Free shipping on orders over $50</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Shield size={20} />
                  <Typography variant="body2">2-year warranty included</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <RotateCcw size={20} />
                  <Typography variant="body2">30-day money-back guarantee</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </ThemeProvider>
    </Suspense>
  )
}