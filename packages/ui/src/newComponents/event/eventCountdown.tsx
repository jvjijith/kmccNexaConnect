"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Paper, Grid } from "@mui/material"

interface CountdownProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function EventCountdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const CountdownItem = ({ value, label }: { value: number; label: string }) => (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: "center",
        backgroundColor: "primary.main",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Typography variant="h3" component="div" sx={{color:"secondary.main"}}>
        {value.toString().padStart(2, "0")}
      </Typography>
      <Typography variant="body2">{label}</Typography>
    </Paper>
  )

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Event Starts In
      </Typography>
      <Grid container spacing={2} justifyContent="center" >
        <Grid item >
          <CountdownItem value={timeLeft.days} label="Days" />
        </Grid>
        <Grid item>
          <CountdownItem value={timeLeft.hours} label="Hours" />
        </Grid>
        <Grid item>
          <CountdownItem value={timeLeft.minutes} label="Minutes" />
        </Grid>
        <Grid item>
          <CountdownItem value={timeLeft.seconds} label="Seconds" />
        </Grid>
      </Grid>
    </Box>
  )
}

