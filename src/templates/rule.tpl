<div class="section rule">

	<div class="form-group" style="line-height: 30px;">

		<strong>Field:</strong> &nbsp;
		<select class="control-rule-field">

			<option>- Select Field -</option>

			{#fields}

				<option value="{label}">{label}</option>

			{/fields}
			
		</select> &nbsp;

		<strong>Condition:</strong> 
		<select>
			<option>Equal</option>
		</select>

		<br/>

		<strong>Value:</strong> &nbsp;
		<select class="control-rule-value" disabled>
			<option>- Select Field -</option>
		</select> &nbsp;

		<strong>Action:</strong> &nbsp;
		<select>
			<option>Show</option>
			<option>Hide</option>			
		</select>

		<br/>

		<strong>Target:</strong> &nbsp;
		<select>
			<option>- Select Target -</option>

			{#targets}

				<option>{label}</option>

			{/targets}

		</select>
	
	</div>

	<button class="control-remove-rule" style="margin-top: 10px;">Remove</button>

</div>
