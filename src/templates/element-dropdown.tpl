<li class="form-element {#required}required{/required}" id="element-{position}" data-label="{label}" data-position="{position}" data-type="element-dropdown">
	<label>
		<span class="label-title">{label}</span>
		{#required}<span class="required-star"> *</span>{/required}
	</label>
	<select style="width: 50%" class="choices" data-type="settings-dropdown" disabled>
		<option class="option-1" val="First Choice" selected><span class="choice-label">First Choice</span></option>
		<option class="option-2" val="Second Choice"><span class="choice-label">Second Choice</span></option>
		<option class="option-3" val="Third Choice"><span class="choice-label">Third Choide</span></option>
	</select>
</li>