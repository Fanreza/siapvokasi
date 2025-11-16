<template>
	<div class="border rounded-xl bg-white p-6 shadow-sm overflow-x-auto">
		<Table>
			<TableHeader>
				<slot name="header" />
			</TableHeader>

			<TableBody>
				<slot name="body" />
			</TableBody>
		</Table>
	</div>
</template>
