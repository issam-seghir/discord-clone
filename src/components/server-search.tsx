"use client"
import React from 'react'

interface ServerSearchProps {
	data: {
		label: string;
		type: "channel" | "member";
		data: {
					icon: React.ReactNode;
					id: string;
					name: string;
			  }[]
			| undefined;
	}[];
}

export  function ServerSearch({data}: ServerSearchProps) {
  return (
    <div>ServerSearch</div>
  )
}
