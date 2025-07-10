"use client"

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button, Container, Typography, Box, Paper, Grid, Chip, Divider, Rating, TextField, ThemeProvider, Skeleton } from "@mui/material"
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Star } from "lucide-react"
import Image from "next/image"
import { getColor, getProduct, getProductPricing } from "../../../src/data/loader"
import { createDynamicTheme } from "@repo/ui/theme"

// Product type definition based on API response
interface Brand {
  name: string;
  category: string;
  active: boolean;
  __v: number;
}

interface Category {
  categoryName: string;
  categoryType: string;
  __v: number;
}

interface SubBrand {
  subBrandName: string;
  brandId: string;
  active: boolean;
  __v: number;
}

interface SubCategory {
  subCategoryName: string;
  subCategoryType: string;
  category: string;
  __v: number;
}

interface ProductImage {
  url: string;
  _id: string;
}

interface PricingRule {
  amount: number;
  currency: string;
  discount: number;
  rules: any[];
  _id: string;
}

interface ProductPricing {
  productId: string;
  variantId: string;
  pricing: PricingRule[];
  active: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

interface Product {
  active: boolean;
  HSN: string;
  RFQ: boolean;
  brand: Brand;
  category: Category;
  description: string;
  images: ProductImage[];
  model: string;
  name: string;
  notes: any[];
  productCode: string;
  stock: number;
  subBrand: SubBrand;
  subCategory: SubCategory;
  variants: any[];
  pricing?: ProductPricing[];
}

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
  const [selectedImage, setSelectedImage] = useState("")

  useEffect(() => {
    async function fetchProduct() {
      try {
        const colorData = await getColor("light");
        if (colorData?.theme?.palette?.primary?.main) {
          setColor(colorData);
        }

        // Fetch product data
        const productData = await getProduct(`${id}`)
        console.log("Product data:", productData)

        // Fetch pricing data
        let pricingData: ProductPricing[] = []
        try {
          pricingData = await getProductPricing(`${id}`)
          console.log("Pricing data:", pricingData)
        } catch (pricingError) {
          console.warn("Could not fetch pricing data:", pricingError)
        }

        // Combine product and pricing data
        const productWithPricing: Product = {
          ...productData,
          pricing: pricingData
        }
        
        setProduct(productWithPricing)
        
        // Set the first image as selected if available
        if (productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0].url)
        }
        
      } catch (error) {
        console.error("Error fetching product:", error)
        // You might want to show an error message to the user here
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const toggleWishlist = () => {
    setInWishlist(!inWishlist)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  // Get price from pricing data
  const getProductPrice = () => {
    if (product?.pricing && product.pricing.length > 0) {
      const firstPricing = product.pricing[0]
      if (firstPricing?.pricing && firstPricing.pricing.length > 0 && firstPricing.pricing[0]) {
        return firstPricing.pricing[0].amount
      }
    }
    return 0
  }

  // Get discount from pricing data
  const getProductDiscount = () => {
    if (product?.pricing && product.pricing.length > 0) {
      const firstPricing = product.pricing[0]
      if (firstPricing?.pricing && firstPricing.pricing.length > 0 && firstPricing.pricing[0]) {
        return firstPricing.pricing[0].discount
      }
    }
    return 0
  }

  if (!product) {
    return <ProductSkeleton />
  }

  const price = getProductPrice()
  const discount = getProductDiscount()
  const discountedPrice = price - (price * discount / 100)
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ThemeProvider theme={createDynamicTheme(color || {})}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Button startIcon={<ArrowLeft />} onClick={() => router.push("/")} sx={{ mb: 4 }} variant="outlined">
            Back to Products
          </Button>

          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)" }}>
            <Grid container spacing={4}>
              {/* Product Images */}
              <Grid item xs={12} md={6}>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 500,
                      borderRadius: 3,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {selectedImage ? (
                      <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "text.secondary",
                        }}
                      >
                        No Image Available
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
                    {product.images.map((img, index) => (
                      <Box
                        key={img._id}
                        sx={{
                          position: "relative",
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: selectedImage === img.url ? "2px solid" : "1px solid",
                          borderColor: selectedImage === img.url ? "primary.main" : "divider",
                          flexShrink: 0,
                        }}
                        onClick={() => setSelectedImage(img.url)}
                      >
                        <Image
                          src={img.url}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Product Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Product Title and Brand */}
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    {product.name}
                  </Typography>
                  
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {product.brand.name} - {product.model}
                  </Typography>

                  {/* Category and Sub-category */}
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Chip label={product.category.categoryName} size="small" />
                    <Chip label={product.subCategory.subCategoryName} size="small" variant="outlined" />
                  </Box>

                  {/* Price */}
                  <Box sx={{ mb: 3 }}>
                    {discount > 0 ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
                          ₹{discountedPrice.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{ textDecoration: "line-through", color: "text.secondary" }}
                        >
                          ₹{price.toFixed(2)}
                        </Typography>
                        <Chip label={`${discount}% OFF`} color="error" size="small" />
                      </Box>
                    ) : price > 0 ? (
                      <Typography variant="h4" component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
                        ₹{price.toFixed(2)}
                      </Typography>
                    ) : (
                      <Typography variant="h6" color="text.secondary">
                        {product.RFQ ? "Request for Quote" : "Price not available"}
                      </Typography>
                    )}
                  </Box>

                  {/* Stock Status */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color={product.stock > 0 ? "success.main" : "error.main"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {product.description}
                  </Typography>

                  {/* Product Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Product Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Product Code:</Typography>
                        <Typography variant="body2">{product.productCode}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">HSN Code:</Typography>
                        <Typography variant="body2">{product.HSN}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Brand:</Typography>
                        <Typography variant="body2">{product.brand.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Sub-Brand:</Typography>
                        <Typography variant="body2">{product.subBrand.subBrandName}</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Quantity and Actions */}
                  {product.stock > 0 && !product.RFQ && (
                    <Box sx={{ mt: "auto" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                        <Typography variant="body1">Quantity:</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <TextField
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            size="small"
                            sx={{ width: 80 }}
                            inputProps={{ min: 1, max: product.stock }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<ShoppingCart />}
                          sx={{ flex: 1 }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={toggleWishlist}
                          sx={{ minWidth: 56 }}
                        >
                          <Heart fill={inWishlist ? "currentColor" : "none"} />
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* RFQ Button */}
                  {product.RFQ && (
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{ width: "100%" }}
                      >
                        Request for Quote
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Additional Information */}
            <Divider sx={{ my: 4 }} />
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Truck size={24} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Free Shipping</Typography>
                    <Typography variant="caption" color="text.secondary">On orders over ₹500</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Shield size={24} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Warranty</Typography>
                    <Typography variant="caption" color="text.secondary">1 year manufacturer warranty</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <RotateCcw size={24} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Easy Returns</Typography>
                    <Typography variant="caption" color="text.secondary">30-day return policy</Typography>
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