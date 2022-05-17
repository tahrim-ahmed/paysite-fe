<template>
	<q-layout>
		<q-page-container>
			<q-page class="row justify-center">
				<div class="col-6 q-px-md q-pt-md">


					<!--	Add Client  -->
<!--					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Add Client Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<div v-if="imageSource !== ''" class="row justify-center">
										<div class="col-12 col-md-4 text-center q-pt-md">
											<q-avatar size="150px" square>
												<q-img :ratio="1" :src="imageSource" width="300px" contain/>
											</q-avatar>
										</div>
									</div>
									<q-form greedy @submit.prevent="saveClient">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.code" label="Client Code" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.name" label="Client Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.contact" label="Client Contact" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.billing" label="Billing Address" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.shipping" label="Shipping Address" outlined dense/>
												</div>
												&lt;!&ndash;												<div class="col-12 col-md-grow q-pt-md">
																									<q-file v-model="image" accept=".jpg, image/*" clearable counter
																											label="Client Image"
																											@clear="setImage" @input="setImage" dense outlined>
																										<template v-slot:prepend>
																											<q-icon name="attach_file"/>
																										</template>
																									</q-file>
																								</div>&ndash;&gt;
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Save" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>-->
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script>
import {Vue} from "vue-property-decorator";

export default class Profile extends Vue{
}
</script>

<style scoped>

</style>
