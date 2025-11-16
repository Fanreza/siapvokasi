<template>
	<Table class="[&_th]:border-none [&_td]:border-none [&_tr]:border-none">
		<TableHeader>
			<slot name="header" />
		</TableHeader>

		<TableBody>
			<slot name="body" />
		</TableBody>
	</Table>
</template>
